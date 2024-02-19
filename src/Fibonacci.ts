// Fibonacci function with memoization
const Fibonacci = (function() {
    const cache = {}; // Cache to store previously computed Fibonacci numbers

    function fib(n) {
        // If the value is cached, return it to avoid computation
        if (cache[n]) {
            return cache[n];
        }

        // Base cases: fib(0) = 0, fib(1) = 1
        if (n < 2) {
            return n;
        }

        // Recursive case: Calculate the nth Fibonacci number
        // and store it in the cache before returning
        cache[n] = fib(n - 1) + fib(n - 2);
        return cache[n];
    }

    return fib; // Return the fib function so it can be used elsewhere
})();

export default Fibonacci;
