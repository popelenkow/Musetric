from pydub import AudioSegment
import sys
import math

dirPath = sys.argv[1]
ext = sys.argv[2]
milliseconds = int(sys.argv[3])

song = AudioSegment.from_file(dirPath + 'input' + ext)
duration = len(song)
print(math.ceil(duration / milliseconds))