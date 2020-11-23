---
marp: true
theme: xenitab
paginate: true
---

<!-- _paginate: false -->
<!-- _class: lead -->

# Terraform Core
## Basics

---

<!-- _paginate: false -->
<!-- _class: lead -->

# Agenda

- Landscape
- Understanding Terraform
- Terraform Components

---

# Vendor Landscape

- Cloud Formation
- ARM Templates
- SDKs

---

# Agnostic Landscape

- Terraform
- Ansible
- Pulumi
- Puppet

---

# Differences

- Language
  - JSON
  - HCL
  - Python or Typescript
- Execution Order
- Statful/Stateless

---

# All at once

- All resources are applied at once
- Alternativly the order is random
- No dependency between resources

![bg contain right](./assets/all-at-once.jpg)

---

# Top to bottom

- Line by line
- Order is always the same
- Pass output as input
- Every step will be run

![bg contain right](./assets/top-to-bottom.jpg)

---

# Dependency based

- Order is based on dependencies

![bg contain right](./assets/dependency.jpg)

---

# Directed Acyclyc Graph

- Vertex - Circles
- Edge - Lines
- Directed - Edges are directed
- Acyclyc - No loops in the graph

![bg contain left](./assets/dag.jpg)

---

# Example

![center](./assets/dag-example.png)

---

# Providers

---


# Resources

- https://www.youtube.com/watch?v=Ce3RNfRbdZ0

---
