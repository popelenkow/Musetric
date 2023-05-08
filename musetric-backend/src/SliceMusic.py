from pydub import AudioSegment
import sys
import math

filePath = sys.argv[1]
chunkDirPath = sys.argv[2]
ext = sys.argv[3]
milliseconds = int(sys.argv[4])

song = AudioSegment.from_file(filePath)
duration = len(song)
count = math.ceil(duration / milliseconds)
print(count)
for i in range(count):
	startTime = i * milliseconds
	endTime = (i + 1) * milliseconds
	extract = song[startTime:endTime]
	extract.export(chunkDirPath + "{0:02d}".format(i) + ext , format=ext[1:])
