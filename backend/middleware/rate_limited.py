import time
import redis.asyncio as redis
from fastapi import FastAPI, Request, HTTPException, Depends



# Kết nối Redis
redis_client = redis.Redis.from_url("redis://127.0.0.1:6379", decode_responses=True)

# Cấu hình Rate Limit
MAX_REQUESTS = 5  # Giới hạn request
TIME_WINDOW = 10   # Giới hạn thời gian (giây)

async def rate_limiter(request: Request):
    """ Kiểm tra số lượng request từ IP """
    client_ip = request.client.host  # Lấy IP user

    # Key lưu số lần request
    redis_key = f"rate_limit:{client_ip}"
    
    # Kiểm tra số request đã thực hiện
    request_count = await redis_client.get(redis_key)
    
    if request_count:
        request_count = int(request_count)
        if request_count >= MAX_REQUESTS:
            raise HTTPException(status_code=429, detail="Too many requests. Please wait.")
    
    # Tăng số request lên 1 và đặt thời gian hết hạn
    await redis_client.incr(redis_key)
    await redis_client.expire(redis_key, TIME_WINDOW)
