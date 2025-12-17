import asyncio
from services import get_voices

async def main():
    voices = await get_voices()
    print(f"Total voices found: {len(voices)}")
    if len(voices) > 0:
        print("First 3 voices:")
        for v in voices[:3]:
            print(v)
    else:
        print("No voices found.")

if __name__ == "__main__":
    asyncio.run(main())
