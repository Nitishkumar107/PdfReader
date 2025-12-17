import asyncio
import edge_tts

TEXT = "Hello world. This is a test of the word boundary feature."
VOICE = "en-US-AriaNeural"
OUTPUT_FILE = "test.mp3"

async def main():
    communicate = edge_tts.Communicate(TEXT, VOICE)
    submaker = edge_tts.SubMaker()
    with open("debug_marks.txt", "w") as log_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                with open(OUTPUT_FILE, "ab") as file:
                    file.write(chunk["data"])
            else:
                log_file.write(f"{chunk}\n")
                if chunk["type"] == "WordBoundary":
                    submaker.feed(chunk)

    print(submaker.get_srt())

if __name__ == "__main__":
    asyncio.run(main())
