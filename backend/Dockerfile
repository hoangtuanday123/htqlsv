FROM python:3.12.4-alpine

WORKDIR /backend

COPY requirements.txt .
RUN python -m ensurepip --upgrade
RUN python -m pip install --upgrade setuptools
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8083

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8083","--proxy-headers","--forwarded-allow-ips=*"]
