import PyPDF2
import edge_tts
from deep_translator import GoogleTranslator
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
import nltk
import os
import uuid
from openai import OpenAI
from dotenv import load_dotenv
import razorpay
import hmac
import hashlib

# Download nltk data
nltk.download('punkt')

# Load environment variables from the root .env file
load_dotenv(dotenv_path="../.env")

# Razorpay Client
# Replace with actual keys via ENV variables in production
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "secret_placeholder")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

from db import db

client = OpenAI(api_key=os.getenv("OPENAI_PDFREADER_KEY"))

async def extract_text_from_pdf(file_path: str) -> str:
    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

async def generate_tts(text: str, voice: str, rate: str, pitch: str) -> dict:
    try:
        print(f"Generating TTS with Voice: {voice}, Rate: {rate}, Pitch: {pitch}")
        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join("static", filename)
        os.makedirs("static", exist_ok=True)
        
        marks = []
        with open(output_path, "wb") as file:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    file.write(chunk["data"])
                elif chunk["type"] == "SentenceBoundary":
                    # edge-tts offsets/durations are in 100ns units (ticks). 1s = 10,000,000 ticks.
                    marks.append({
                        "start": chunk["offset"] / 10_000_000,
                        "end": (chunk["offset"] + chunk["duration"]) / 10_000_000,
                        "text": chunk["text"]
                    })
                    
        print(f"TTS saved to: {output_path}")
        return {"audio_file": output_path, "marks": marks}
    except Exception as e:
        print(f"Error generating TTS: {e}")
        raise e

def translate_text(text: str, target_lang: str) -> str:
    try:
        translator = GoogleTranslator(source='auto', target=target_lang)
        # Split text if too long (simple chunking)
        chunks = [text[i:i+4000] for i in range(0, len(text), 4000)]
        translated_chunks = [translator.translate(chunk) for chunk in chunks]
        return " ".join(translated_chunks)
    except Exception as e:
        print(f"Error translating: {e}")
        return "Translation failed."

def summarize_text(text: str, sentences_count: int = 5) -> str:
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        print(f"DEBUG: API Key loaded: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")
        
        if not client.api_key:
            print("DEBUG: Client API key is missing")
            return "Error: OpenAI API Key not found in .env"
            
        print("DEBUG: Sending request to OpenAI...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text concisely."},
                {"role": "user", "content": f"Please summarize the following text in about {sentences_count} sentences:\n\n{text[:10000]}"}
            ]
        )
        print("DEBUG: OpenAI response received")
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error summarizing with OpenAI: {e}")
        return f"Summarization failed: {str(e)}"

async def get_voices():
    try:
        voices = await edge_tts.list_voices()
        # Filter for Neural voices and common languages to reduce clutter, or just format them nicely
        # We'll keep all Neural voices but format the name
        formatted_voices = []
        for v in voices:
            if "Neural" in v['ShortName']:
                # Parse locale and name
                # ShortName format: en-US-AriaNeural
                parts = v['ShortName'].split('-')
                locale = f"{parts[0]}-{parts[1]}"
                name = parts[2].replace('Neural', '')
                
                # Create a readable label
                friendly_name = f"{locale} - {name} ({v['Gender']})"
                
                formatted_voices.append({
                    'ShortName': v['ShortName'],
                    'FriendlyName': friendly_name,
                    'Gender': v['Gender'],
                    'Locale': v['Locale']
                })
        
        # Sort by Locale then Name
        formatted_voices.sort(key=lambda x: (x['Locale'], x['FriendlyName']))
        return formatted_voices
    except Exception as e:
        print(f"Error fetching voices: {e}")
        return []

async def sync_user(user_data: dict):
    try:
        # Check if user exists
        user = await db.user.find_unique(where={'id': user_data['id']})
        
        if not user:
            # Create new user
            user = await db.user.create(data={
                'id': user_data['id'],
                'email': user_data['email'],
                'name': user_data['name'],
                # image_url is not in schema, so we skip it
            })
            print(f"User created: {user.id}")
        else:
            print(f"User already exists: {user.id}")
            
        return {"success": True, "user": user.dict(), "plan": user.plan}
    except Exception as e:
        print(f"Error syncing user: {e}")
        return {"success": False, "error": str(e)}

async def create_subscription(plan_id: str, customer_id: str = None):
    try:
        # In a real app, you might want to create a customer in Razorpay first 
        # and pass that customer_id here to link them.
        
        subscription_data = {
            "plan_id": plan_id,
            "customer_notify": 1,
            "total_count": 120, # 10 years (just a large number for recurring)
            "quantity": 1,
            "addons": [],
        }
        
        subscription = razorpay_client.subscription.create(subscription_data)
        return {"success": True, "subscription_id": subscription['id'], "key_id": RAZORPAY_KEY_ID}
    except Exception as e:
        print(f"Error creating subscription: {e}")
        return {"success": False, "error": str(e)}

async def verify_payment(payment_id: str, subscription_id: str, signature: str, plan_name: str, user_id: str):
    try:
        # Verify Signature
        data = f"{payment_id}|{subscription_id}"
        
        generated_signature = hmac.new(
            bytes(RAZORPAY_KEY_SECRET, 'utf-8'),
            bytes(data, 'utf-8'),
            hashlib.sha256
        ).hexdigest()

        if generated_signature == signature:
            # Payment Successful - Update User Plan in DB
            # We map the plan_name passed from frontend (e.g. "Pro") to the DB enum
            db_plan = "premium" if "Pro" in plan_name else "enterprise" if "Enterprise" in plan_name else "free"
            
            await db.user.update(
                where={"id": user_id},
                data={"plan": db_plan}
            )
            return {"success": True}
        else:
            return {"success": False, "error": "Invalid Signature"}
            
    except Exception as e:
        print(f"Error verifying payment: {e}")
        return {"success": False, "error": str(e)}
