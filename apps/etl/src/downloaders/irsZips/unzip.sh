#!/bin/bash

# Run from ETL root
# sh ./src/downloaders/irsZips/unzip.sh

# Load environment variables from .env.local
if [[ -f .env.local ]]; then
  echo "Loading environment variables from .env.local"
  # shellcheck disable=SC1091
  source .env.local
else
  echo "Warning: .env.local file not found in current directory"
fi

# Check if FILINGS_ROOT environment variable is set
  if [[ -z "$FILINGS_ROOT" ]]; then
    echo "Error: FILINGS_ROOT environment variable is not set"
    exit 1
  fi

function unzip_to_target() {
  local source_dir="$HOME/$FILINGS_ROOT/zipped/updates"
  local target_root="$HOME/$FILINGS_ROOT/xml/updates"
  local filename
  local target_dir

  echo "Source directory: $source_dir"
  echo "Target root directory: $target_root"
  echo ""


  # Check if source directory exists
  if [[ ! -d "$source_dir" ]]; then
    echo "Error: Source directory does not exist: $source_dir"
    exit 1
  fi

  # Check if there are zip files in the source directory
  if compgen -G "${source_dir}/*.zip" > /dev/null; then
    # Loop through each .zip file in the source directory
    for zip_file in "$source_dir"/*.zip; do
      # Extract the filename without extension
      filename=$(basename "$zip_file" .zip)

      # Create target directory
      target_dir="$target_root/$filename"
      mkdir -p "$target_dir"

      # Echo message indicating the start of unzipping
      echo "Unzipping to directory: $target_dir"

      # Unzip the file to the target directory
      if ! unzip -o "$zip_file" -d "$target_dir" > /dev/null; then
        echo "Error unzipping file: $zip_file"
        continue
      fi
    done
  else
    echo "No .zip files found in $source_dir"
    exit 1
  fi
}

unzip_to_target
