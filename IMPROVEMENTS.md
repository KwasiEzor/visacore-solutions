# Plan d'Amélioration - VisaCore Solutions

Ce document détaille les étapes d'amélioration du projet, classées par priorité technique et impact utilisateur.

## 🚀 Phase 1 : Robustesse & Sécurité (Priorité Haute)
- [ ] **1.1 Standardisation de la gestion des erreurs dans les Server Actions**
    - Ajouter des blocs `try/catch` systématiques.
    - Retourner des objets d'erreur structurés `{ success: boolean, error?: string, details?: any }`.
    - Journalisation (logging) des erreurs côté serveur.
- [ ] **1.2 Renforcement du Typage & Validation Zod**
    - Éliminer les casts de type non sécurisés (`as`).
    - Utiliser les énumérations Zod pour valider les statuts avant l'insertion en base.
    - Synchroniser les schémas Zod avec les énumérations Prisma.
- [ ] **1.3 Amélioration du RBAC (Role-Based Access Control)**
    - Sécuriser les Server Actions avec des vérifications de rôle spécifiques.
    - Mettre à jour le Middleware pour une gestion plus fine des permissions `/admin`.

## 🎨 Phase 2 : Expérience Utilisateur (Priorité Moyenne)
- [ ] **2.1 États de Chargement & Skeletons**
    - Ajouter des fichiers `loading.tsx` pour toutes les routes admin.
    - Créer des composants de chargement (Skeletons) pour les tableaux et les formulaires.
- [ ] **2.2 Feedback Interactif Systématique**
    - Intégrer `sonner` dans tous les formulaires côté client pour confirmer les actions.
    - Gérer les états d'erreur visuels (bordures rouges, messages d'aide).

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
