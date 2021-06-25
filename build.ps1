.\Scripts\python .\TTS\bin\compute_statistics.py --config_path config.json --out_path scale_stats.npy
.\Scripts\python .\TTS\bin\train_tacotron.py --config_path config.json

.\Scripts\python .\TTS\bin\train_vocoder_wavernn.py --config_path wavernn_config.json


pushd /mnt/c/Users/avaer/Documents/Image-Line/FL\ Studio/Audio/Rendered/;
for f in *; do
  ffmpeg -i "$f" -ac 1 -ar 24000 "/mnt/c/Users/avaer/Documents/GitHub/TTS/wavs/${f%%.*}.wav"
done;
podp;