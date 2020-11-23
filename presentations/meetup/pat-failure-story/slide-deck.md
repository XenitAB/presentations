---
marp: true
theme: xenitab
paginate: true
---

<!-- _paginate: false -->
<!-- _class: lead -->

# PAT Failure Story
## How I messed up

---

# Background

- Personal Access Token (PAT)
- Used to authenticate with Azure DevOps
- No API to automate renewal
- Created per user

---

# GitOps at Xenit

- Azure DevOps repositories
- Flux instance per namespace
- Single PAT shared by [azdo-proxy](https://github.com/XenitAB/azdo-proxy)

![bg w:60% right](./assets/diagram.jpg)

---

# What could go wrong?

- Lots of things

![bg left](./assets/unsplash/valentin-salja-0aX51h4WvAk-unsplash.jpg)

---

# What went wrong?

![40% bg](./assets/email.png)

---

## Solution

```golang
ticker := time.NewTicker(1 * time.Minute)
go func() {
  for {
    select {
    case <-ticker.C:
      err = validatePat(config.Pat, config.Organization)
      if err != nil {
        os.Exit(1)
      }
    case <-done:
      ticker.Stop()
      return
    }
  }
}()
```

---

# What i learned

- Fail fast and loud
- Monitor CD

---
