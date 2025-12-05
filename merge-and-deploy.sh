#!/bin/bash
# Script pour merger et déployer les changements

echo "📦 Récupération de la dernière version..."
git fetch origin

echo "🔀 Passage sur main..."
git checkout main
git pull origin main

echo "✨ Merge de la branche avec les corrections..."
git merge claude/fix-book-modal-mobile-01DHLUyeo2Dasj4pPGHZ4dx5 --no-ff -m "Merge: Add dating preferences and force demo profiles update"

echo "🚀 Push vers main..."
git push origin main

echo "✅ Déploiement terminé ! Vercel va rebuilder automatiquement dans 1-2 minutes."
echo "📱 Rechargez votre site après 2 minutes."
