import random

# Check if a number is prime using Miller-Rabin primality test
def is_prime(n, k=5):
    if n <= 1:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False

    # Write n as 2^r * d + 1
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2

    # Witness loop
    for _ in range(k):
        a = random.randint(2, n - 2)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True

# Generate a large prime number with the specified bit length.
def generate_prime(bit_length):
    while True:
        candidate = random.getrandbits(bit_length)
        if candidate % 2 == 0:
            candidate += 1  # Make sure it's odd
        if is_prime(candidate):
            return candidate
        
# Check if g is a primitive root modulo p.
def is_primitive_root(g, p):
    if pow(g, p - 1, p) != 1:
        return False

    factors = set()
    phi = p - 1  # Euler's totient function

    for i in range(2, int(phi**0.5) + 1):
        if phi % i == 0:
            factors.add(i)
            factors.add(phi // i)

    for factor in factors:
        if pow(g, factor, p) == 1:
            return False

    return True

# Find a primitive root modulo p.
def get_primitive_root(p):
    if not is_prime(p):
        raise ValueError("Input must be a prime number.")

    for g in range(2, p):
        if is_primitive_root(g, p):
            return g

# Generate a public/private key pair.
def generate_random(p):
    x = random.randint(1, p - 1)
    return x