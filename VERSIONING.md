# Versioning Strategy

## Package Versioning

Versions in `package.json` are automatically bumped when code is merged to `main`.

**Commit format:**
- `feat:` → Minor bump (1.0.0 → 1.1.0)
- `fix:` → Patch bump (1.0.0 → 1.0.1)
- `feat!:` → Major bump (1.0.0 → 2.0.0)

**Feature branches:** Not versioned. Version only updates on `main`.

## Docker Versioning

**Main branch:**
```
myapp:1.2.3 (from package.json)
myapp:latest
```

**Feature branches:**
```
myapp:feature-name-abc1234 (branch + commit SHA)
```
