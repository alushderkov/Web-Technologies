<?php
class CryptoManager {
    private $algorithm;
    private $password;
    private $ivLength;

    public function __construct(string $algorithm, string $password) {
        if (!in_array($algorithm, openssl_get_cipher_methods(true))) {
            throw new InvalidArgumentException("Unsupported encryption algorithm: {$algorithm}");
        }

        $this->algorithm = $algorithm;
        $this->password = $password;
        $this->ivLength = openssl_cipher_iv_length($algorithm);

        if ($this->ivLength === false) {
            throw new RuntimeException("Failed to determine IV length for algorithm: {$algorithm}");
        }
    }

    public function encrypt(string $plaintext): string {
        $iv = openssl_random_pseudo_bytes($this->ivLength);
        if ($iv === false) {
            throw new RuntimeException("Failed to generate IV");
        }

        $ciphertext = openssl_encrypt(
            $plaintext,
            $this->algorithm,
            $this->password,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($ciphertext === false) {
            throw new RuntimeException("Encryption failed");
        }

        return base64_encode($iv . $ciphertext);
    }

    public function decrypt(string $encrypted): string {
        $data = base64_decode($encrypted);
        if ($data === false) {
            throw new InvalidArgumentException("Invalid base64 data");
        }

        $iv = substr($data, 0, $this->ivLength);
        $ciphertext = substr($data, $this->ivLength);

        if ($iv === false || $ciphertext === false) {
            throw new InvalidArgumentException("Invalid encrypted data format");
        }

        $plaintext = openssl_decrypt(
            $ciphertext,
            $this->algorithm,
            $this->password,
            OPENSSL_RAW_DATA,
            $iv
        );

        if ($plaintext === false) {
            throw new RuntimeException("Decryption failed");
        }

        return $plaintext;
    }
}
?>