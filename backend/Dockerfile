FROM python:3.13-slim

WORKDIR /app

# Install system utilities needed for building packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker layer caching
COPY requirement.txt .

# Install dependencies in requirement.txt and the sentence-transformers library
RUN pip install --no-cache-dir -r requirement.txt sentence-transformers

# Copy the rest of the application files
COPY . .

# Expose port 7860 (Hugging Face Spaces default port)
EXPOSE 7860

# Start Uvicorn, dynamically binding to the port (defaulting to 7860 for Hugging Face)
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"
