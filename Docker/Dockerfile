# Use a Node.js base image
FROM node:18

# Install Python and required dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean

# Set working directory
WORKDIR /app

# Create a virtual environment for Python dependencies
RUN python3 -m venv /app/venv

# Install Python dependencies
RUN /app/venv/bin/pip install flask matplotlib numpy scipy

# Copy Node.js dependencies
COPY app/Code/server/package.json app/Code/server/package-lock.json ./Code/server/

# Install Node.js dependencies
RUN npm install --prefix ./Code/server

# Copy all application files
COPY app/Code/ /app/Code/

# Expose necessary ports (for debugging, you may want to remove unused ones later)
EXPOSE 80 5000

# Run both Node.js and Flask apps in parallel
CMD ["sh", "-c", "npm run start --prefix ./Code/server & /app/venv/bin/python /app/Code/server/python/python.py"]

