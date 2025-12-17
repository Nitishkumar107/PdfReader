import asyncio
import edge_tts

async def main():
    voices = await edge_tts.list_voices()
    if voices:
        print(voices[0].keys())
        print(voices[0])

if __name__ == "__main__":
    asyncio.run(main())
