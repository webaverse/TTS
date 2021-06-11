.\Scripts\python .\TTS\bin\compute_statistics.py --config_path config.json --out_path scale_stats.npy
.\Scripts\python .\TTS\bin\train_tacotron.py --config_path config.json

pushd /mnt/c/Users/avaer/Documents/Image-Line/FL\ Studio/Audio/Rendered/;
for f in *; do
  echo -i "$f" -ac 1 wavs/${f%%.*}.wav
done;
podp;
