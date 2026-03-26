# Plan d'Amélioration - VisaCore Solutions

Ce document détaille les étapes d'amélioration du projet, classées par priorité technique et impact utilisateur.

## 🚀 Phase 1 : Robustesse & Sécurité (Terminé)
- [x] **1.1 Standardisation de la gestion des erreurs dans les Server Actions**
- [x] **1.2 Renforcement du Typage & Validation Zod**
- [x] **1.3 Amélioration du RBAC (Role-Based Access Control)**

## 🎨 Phase 2 : Expérience Utilisateur (Terminé)
- [x] **2.1 États de Chargement & Skeletons**
- [x] **2.2 Feedback Interactif Systématique**

## 🛠️ Phase 3 : Optimisation & Features (Priorité Basse)
- [ ] **3.1 Tableaux de Données Avancés**
    - Ajouter des fonctionnalités de recherche et filtrage dans l'admin (Leads, Contacts).
    - Implémenter la pagination côté serveur si nécessaire.
- [ ] **3.2 Audit d'Accessibilité (A11y)**
    - Vérifier les contrastes et les attributs ARIA.
    - S'assurer de la navigation complète au clavier.
- [ ] **3.3 Optimisation de l'adaptateur Prisma**
    - Évaluer le passage à `@prisma/adapter-neon` pour de meilleures performances serverless.

---
*Note : Chaque étape sera validée par un test de vérification avant d'être commitée.*
