def mcd(a, b):
    #retorna gcd(a, b) usando gcd(a, b) = gcd(b, a mod b)
    a, b = abs(a), abs(b)
    while b != 0:
        a, b = b, a % b
    return a

def euclides_extendido(a, b):
    #retorna (g, x, y) tal que g = gcd(a, b) y a*x + b*y = g
    r0, r1 = a, b
    x0, x1 = 1, 0
    y0, y1 = 0, 1
    while r1 != 0:
        q = r0 // r1
        r0, r1 = r1, r0 - q * r1
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    return r0, x0, y0

def inverso_modular(a, n):
    #retorna a^(-1) mod n. Existe sólo si gcd(a, n) = 1
    #si a*x + n*y = 1 (Bézout), entonces a*x ≡ 1 (mod n)
    g, x, _ = euclides_extendido(a, n)
    if g != 1:
        raise ValueError(f"No existe inverso: gcd({a}, {n}) = {g} != 1")
    return x % n

def potencia_modular(a, k, n):
    #retorna a^k mod n recorriendo los bits de k (de menor a mayor)
    #nunca se calcula a^k completo: cada paso se reduce mod n
    #complejidad O(log k) multiplicaciones
    resultado = 1
    base = a % n
    while k > 0:
        if k & 1:
            resultado = (resultado * base) % n
        base = (base * base) % n
        k >>= 1
    return resultado

def factorizar(n):
    #retorna (p, q) con p*q = n probando divisores hasta sqrt(n)
    if n % 2 == 0:
        return 2, n // 2
    d = 3
    while d * d <= n:
        if n % d == 0:
            return d, n // d
        d += 2
    return None


def descifrar(n, e, c, verbose=True):
    #ejecuta toda la cadena: n -> p,q -> phi -> d -> M, con verificacion
    print("=" * 60)
    print(f"n = {n}, e = {e}, C = {c}")

    f = factorizar(n)
    if f is None or f[0] == 1:
        print("n es primo o no se pudo factorizar: no es posible continuar.")
        return None
    p, q = f
    print(f"Factores de n: p = {p}, q = {q} (p*q = {p * q})")

    phi = (p - 1) * (q - 1)
    print(f"phi(n) = (p-1)(q-1) = {p - 1} * {q - 1} = {phi}")

    g = mcd(e, phi)
    print(f"gcd(e, phi(n)) = gcd({e}, {phi}) = {g}")
    if g != 1:
        print("gcd != 1: e no es válido, d no existe. No es posible continuar.")
        return None

    g, x, y = euclides_extendido(e, phi)
    print(f"Bézout: {e}*({x}) + {phi}*({y}) = {g}")
    d = inverso_modular(e, phi)
    print(f"Clave privada d = {d} (verif: e*d mod phi = {(e * d) % phi})")

    m = potencia_modular(c, d, n)
    print(f"Mensaje recuperado M = C^d mod n = {m}")

    c_ver = potencia_modular(m, e, n)
    print(f"Verificación: M^e mod n = {c_ver} -> {'OK' if c_ver == c else 'FALLA'}")
    return m


def main():
    print("Auditoría RSA")
    n = int(input("n = "))
    e = int(input("e = "))
    entrada = input("C (uno o varios separados por coma) = ")
    for c in [int(t) for t in entrada.split(",") if t.strip()]:
        descifrar(n, e, c)


if __name__ == "__main__":
    main()