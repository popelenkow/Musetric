from pydub import AudioSegment
import sys
import math

filePath = sys.argv[1]
milliseconds = int(sys.argv[2])

song = AudioSegment.from_file(filePath)
duration = len(song)
print(math.ceil(duration / milliseconds))