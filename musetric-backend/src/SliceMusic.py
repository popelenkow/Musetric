from pydub import AudioSegment
import sys
import math

dirPath = sys.argv[1]
ext = sys.argv[2]
milliseconds = int(sys.argv[3])

song = AudioSegment.from_file(dirPath + 'input' + ext)
duration = len(song)
count = math.ceil(duration / milliseconds)
print(count)
for i in range(count):
	startTime = i * milliseconds
	endTime = (i + 1) * milliseconds
	extract = song[startTime:endTime]
	extract.export(dirPath + "inputChunks/" + "{0:02d}".format(i) + ext , format=ext[1:])
