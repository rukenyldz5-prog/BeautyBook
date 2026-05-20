// Jest çalışırken .env olmasa bile JWT imzalama patlamasın (yalnızca test).
process.env.JWT_SECRET = process.env.JWT_SECRET || "jest-test-secret-only-not-for-production";
