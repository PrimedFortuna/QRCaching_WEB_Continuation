
FROM node:18


RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean


WORKDIR /app


RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install flask matplotlib numpy scipy


COPY app/Code/server/package.json app/Code/server/package-lock.json ./Code/server/


RUN npm install --prefix ./Code/server


COPY app/Code/ /app/Code/


EXPOSE 80 5000


CMD ["sh", "-c", "npm run start --prefix ./Code/server & /app/venv/bin/python /app/Code/server/python/python.py"]

