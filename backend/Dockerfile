FROM python:3.11-slim

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

# Expose port 8000 (standard for FastAPI, though overridden by PORT env var)
EXPOSE 8000

# Start Uvicorn, dynamically binding to the port assigned by the host (defaulting to 8000)
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
