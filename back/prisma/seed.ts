import { PrismaClient, Profession, TaskStatus } from '@prisma/client';
// Utilisation de require pour éviter les problèmes de typage avec ts-node dans le conteneur
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer la base de données (dans l'ordre inverse des dépendances)
  await prisma.userReceivesNotifications.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.line.deleteMany({});
  await prisma.estimate.deleteMany({});
  await prisma.taskHasProfession.deleteMany({});
  await prisma.profileHasProfession.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.profession.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Base de données nettoyée');

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // --- 1. Créer 4 Users (2 customers + 2 entreprises) ---
  // Suppression de 'email_confirmation_token'
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@test.com',
      password: hashedPassword,
      role: 'customer',
      is_validated: true,
      created_at: now,
      updated_at: now,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@test.com',
      password: hashedPassword,
      role: 'customer',
      is_validated: true,
      created_at: now,
      updated_at: now,
    },
  });

  const entreprise1 = await prisma.user.create({
    data: {
      email: 'entreprise1@test.com',
      password: hashedPassword,
      role: 'entreprise',
      is_validated: true,
      created_at: now,
      updated_at: now,
    },
  });

  const entreprise2 = await prisma.user.create({
    data: {
      email: 'entreprise2@test.com',
      password: hashedPassword,
      role: 'entreprise',
      is_validated: true,
      created_at: now,
      updated_at: now,
    },
  });

  console.log('✅ 4 Utilisateurs créés (2 customers, 2 entreprises)');

  // --- 2. Créer 8 Addresses ---
  const address1 = await prisma.address.create({
    data: { address_line_1: '123 Rue de la Paix', zip_code: '75001', city: 'Paris', country: 'France', created_at: now, updated_at: now },
  });
  const address2 = await prisma.address.create({
    data: { address_line_1: '456 Avenue des Champs', zip_code: '69001', city: 'Lyon', country: 'France', created_at: now, updated_at: now },
  });
  const address3 = await prisma.address.create({
    data: { address_line_1: '789 Boulevard Victor Hugo', zip_code: '33000', city: 'Bordeaux', country: 'France', created_at: now, updated_at: now },
  });
  const address4 = await prisma.address.create({
    data: { address_line_1: '12 Place de la Mairie', zip_code: '59000', city: 'Lille', country: 'France', created_at: now, updated_at: now },
  });
  const address5 = await prisma.address.create({
    data: { address_line_1: '34 Rue du Commerce', zip_code: '13001', city: 'Marseille', country: 'France', created_at: now, updated_at: now },
  });
  const address6 = await prisma.address.create({
    data: { address_line_1: '56 Avenue de la République', zip_code: '31000', city: 'Toulouse', country: 'France', created_at: now, updated_at: now },
  });
  const address7 = await prisma.address.create({
    data: { address_line_1: '99 Rue du Démarrage', zip_code: '44000', city: 'Nantes', country: 'France', created_at: now, updated_at: now },
  });
  const address8 = await prisma.address.create({
    data: { address_line_1: '88 Place du Travail', zip_code: '67000', city: 'Strasbourg', country: 'France', created_at: now, updated_at: now },
  });

  console.log('✅ 8 Adresses créées');

  // --- 3. Créer 4 Profiles (Suppression des champs enrichis non-existants) ---
  const profile1 = await prisma.profile.create({
    data: {
      name: 'Dupont',
      firstName: 'Jean',
      telephone: '0601020304',
      is_newbie: false,
      user_id: customer1.id,
      address_id: address1.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'avatar_url'
    },
  });

  const profile2 = await prisma.profile.create({
    data: {
      name: 'Bernard',
      firstName: 'Marie',
      telephone: '0612131415',
      is_newbie: true,
      user_id: customer2.id,
      address_id: address2.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'marketing_opt_in'
    },
  });

  const profile3 = await prisma.profile.create({
    data: {
      name: 'Martin',
      firstName: 'Sophie',
      telephone: '0605060708',
      is_newbie: false,
      raisonSociale: 'Martin Constructions',
      siret: '12345678901234',
      user_id: entreprise1.id,
      address_id: address3.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'tva_number', 'capital', 'website_url'
    },
  });

  const profile4 = await prisma.profile.create({
    data: {
      name: 'Lefebvre',
      firstName: 'Pierre',
      telephone: '0698765432',
      is_newbie: false,
      raisonSociale: 'Lefebvre Électricité',
      siret: '98765432109876',
      user_id: entreprise2.id,
      address_id: address4.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'tva_number', 'capital', 'kbis_attachment_url'
    },
  });

  console.log('✅ 4 Profils créés');

  // --- 4. Créer toutes les Professions (50 existantes) ---
  const professionNames = [
    "Maçonnerie", "Gros œuvre", "Charpente", "Couverture", "Zinguerie",
    "Étanchéité", "Plomberie", "Chauffage", "Climatisation", "Ventilation (CVC)",
    "Électricité", "Domotique", "Menuiserie intérieure", "Menuiserie extérieure", "Isolation",
    "Cloisons / Placo", "Peinture", "Revêtements sols", "Carrelage / Faïence", "Parquet",
    "Serrurerie / Métallerie", "Vitrerie", "Plâtrerie", "Terrassement", "VRD",
    "Paysagisme", "Piscine", "Ferronnerie", "Ascenseur / Monte-charge", "Contrôle d'accès",
    "Alarme / Sécurité", "Photovoltaïque", "Pompe à chaleur", "Désamiantage", "Dépollution",
    "Ravalement de façade", "Traitement de toiture", "Charpente métallique", "Ebénisterie", "Staff / Stuc",
    "Gypse / Enduits", "Antennes / Courants faibles", "Bardage", "Chapes / Ragréage", "Béton décoratif",
    "Portes / Portails automatiques", "Stores / Volets", "Génie civil léger",
  ];

  const professions: Profession[] = [];
  for (const professionName of professionNames) {
    const profession = await prisma.profession.create({
      data: { profession_name: professionName, created_at: now, updated_at: now },
    });
    professions.push(profession);
  }

  // Garder des références aux professions courantes pour le reste du seed
  const maconnerie = professions.find(p => p.profession_name === 'Maçonnerie')!;
  const plomberie = professions.find(p => p.profession_name === 'Plomberie')!;
  const electricite = professions.find(p => p.profession_name === 'Électricité')!;
  const peinture = professions.find(p => p.profession_name === 'Peinture')!;
  const chauffage = professions.find(p => p.profession_name === 'Chauffage')!;
  const carrelage = professions.find(p => p.profession_name === 'Carrelage / Faïence')!;

  console.log(`✅ ${professions.length} Professions créées`);

  // --- 5. Créer 4 ProfileHasProfession ---
  // Entreprise 1 (Plomberie + Maçonnerie)
  await prisma.profileHasProfession.create({
    data: { profile_id: profile3.id, profession_id: plomberie.id, created_at: now, updated_at: now },
  });
  await prisma.profileHasProfession.create({
    data: { profile_id: profile3.id, profession_id: maconnerie.id, created_at: now, updated_at: now },
  });
  // Entreprise 2 (Électricité + Chauffage)
  await prisma.profileHasProfession.create({
    data: { profile_id: profile4.id, profession_id: electricite.id, created_at: now, updated_at: now },
  });
  await prisma.profileHasProfession.create({
    data: { profile_id: profile4.id, profession_id: chauffage.id, created_at: now, updated_at: now },
  });

  console.log('✅ 4 ProfileHasProfession créés');

  // --- 6. Créer 4 Projects (Suppression de 'status' et 'end_date') ---
  // Projet 1
  const project1 = await prisma.project.create({
    data: {
      title: 'Rénovation Salle de bain',
      description: 'Rénovation complète de la salle de bain avec nouvelle plomberie et carrelage',
      start_date: now,
      // Suppression de 'status'
      address_id: address5.id,
      customer_id: customer1.id,
      entreprise_id: entreprise1.id,
      is_finished: false,
      created_at: now,
      updated_at: now,
    },
  });

  // Projet 2
  const project2 = await prisma.project.create({
    data: {
      title: 'Installation électrique',
      description: 'Mise aux normes de l\'installation électrique et installation pompe à chaleur',
      start_date: now,
      // Suppression de 'status'
      address_id: address6.id,
      customer_id: customer2.id,
      entreprise_id: entreprise2.id,
      is_finished: false,
      created_at: now,
      updated_at: now,
    },
  });

  // Projet 3
  const project3 = await prisma.project.create({
    data: {
      title: 'Construction Muret de Jardin',
      description: 'Construction d\'un muret en pierre sèche de 15 mètres de long',
      start_date: lastMonth,
      // Suppression de 'end_date' et 'status'
      address_id: address7.id,
      customer_id: customer1.id,
      entreprise_id: entreprise1.id,
      is_finished: true,
      created_at: lastMonth,
      updated_at: now,
    },
  });

  // Projet 4
  const project4 = await prisma.project.create({
    data: {
      title: 'Remplacement Chaudière',
      description: 'Remplacement de la chaudière à gaz existante par un modèle à condensation haute performance',
      start_date: nextMonth,
      // Suppression de 'status'
      address_id: address8.id,
      customer_id: customer2.id,
      entreprise_id: entreprise2.id,
      is_finished: false,
      created_at: now,
      updated_at: now,
    },
  });

  console.log('✅ 4 Projets créés');

  // --- 7. Créer 5 Tasks (Suppression de 'priority' et 'completion_percentage') ---
  // Projet 1
  const task1 = await prisma.task.create({
    data: {
      title: 'Démontage ancien équipement',
      description: 'Démontage de l\'ancienne salle de bain et mise en déchetterie',
      start_date: now,
      end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 jours
      status: 'started' as TaskStatus,
      user_id: entreprise1.id,
      project_id: project1.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'priority'
    },
  });
  const task_p1_2 = await prisma.task.create({ // Nouvelle tâche P1
    data: {
      title: 'Pose Carrelage Mural',
      description: 'Pose de faïence murale dans la douche et au sol',
      start_date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      end_date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      status: 'pending' as TaskStatus,
      user_id: entreprise1.id,
      project_id: project1.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'priority'
    },
  });

  // Projet 2
  const task2 = await prisma.task.create({
    data: {
      title: 'Installation nouveaux câbles',
      description: 'Pose des nouveaux câbles électriques pour le tableau de répartition',
      start_date: now,
      end_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 jours
      status: 'started' as TaskStatus,
      user_id: entreprise2.id,
      project_id: project2.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'priority'
    },
  });

  // Projet 3 (Tâche terminée)
  const task_p3_1 = await prisma.task.create({ // Nouvelle tâche P3
    data: {
      title: 'Fondations et soubassements',
      description: 'Creusement des fondations et coulage du béton',
      start_date: lastMonth,
      end_date: new Date(lastMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 'finished' as TaskStatus, // Changement pour un statut existant dans votre ENUM
      user_id: entreprise1.id,
      project_id: project3.id,
      created_at: lastMonth,
      updated_at: new Date(lastMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
      // Suppression de 'priority' et 'completion_percentage'
    },
  });

  // Projet 4 (Tâche future)
  const task_p4_1 = await prisma.task.create({ // Nouvelle tâche P4
    data: {
      title: 'Livraison et Préparation',
      description: 'Livraison de la nouvelle chaudière et outillage',
      start_date: nextMonth,
      end_date: new Date(nextMonth.getTime() + 1 * 24 * 60 * 60 * 1000),
      status: 'pending' as TaskStatus,
      user_id: entreprise2.id,
      project_id: project4.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'priority' et 'completion_percentage'
    },
  });

  console.log('✅ 5 Tâches créées');

  // --- 8. Créer 5 TaskHasProfession ---
  await prisma.taskHasProfession.create({ data: { task_id: task1.id, profession_id: plomberie.id, created_at: now, updated_at: now } });
  await prisma.taskHasProfession.create({ data: { task_id: task_p1_2.id, profession_id: carrelage.id, created_at: now, updated_at: now } });
  await prisma.taskHasProfession.create({ data: { task_id: task2.id, profession_id: electricite.id, created_at: now, updated_at: now } });
  await prisma.taskHasProfession.create({ data: { task_id: task_p3_1.id, profession_id: maconnerie.id, created_at: now, updated_at: now } });
  await prisma.taskHasProfession.create({ data: { task_id: task_p4_1.id, profession_id: chauffage.id, created_at: now, updated_at: now } });

  console.log('✅ 5 TaskHasProfession créés');

  // --- 9. Créer 4 Estimates ---
  // Devis 1
  const estimate1 = await prisma.estimate.create({
    data: {
      object: 'Devis rénovation salle de bain',
      estimate_number: 1001,
      payment_type: 'bank_transfer',
      is_validated_by_customer: true,
      limit_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      project_id: project1.id,
      user_id: entreprise1.id,
      created_at: now,
      updated_at: now,
    },
  });

  // Devis 2
  const estimate2 = await prisma.estimate.create({
    data: {
      object: 'Devis installation électrique',
      estimate_number: 1002,
      payment_type: 'credit_card',
      is_validated_by_customer: true,
      limit_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      project_id: project2.id,
      user_id: entreprise2.id,
      created_at: now,
      updated_at: now,
    },
  });

  // Devis 3
  const estimate3 = await prisma.estimate.create({
    data: {
      object: 'Devis construction muret',
      estimate_number: 1003,
      payment_type: 'check',
      is_validated_by_customer: true,
      limit_date: new Date(lastMonth.getTime() + 10 * 24 * 60 * 60 * 1000),
      project_id: project3.id,
      user_id: entreprise1.id,
      created_at: lastMonth,
      updated_at: lastMonth,
    },
  });

  // Devis 4
  const estimate4 = await prisma.estimate.create({
    data: {
      object: 'Devis remplacement chaudière',
      estimate_number: 1004,
      payment_type: 'bank_transfer',
      is_validated_by_customer: false,
      limit_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      project_id: project4.id,
      user_id: entreprise2.id,
      created_at: now,
      updated_at: now,
    },
  });

  console.log('✅ 4 Devis créés');

  // --- 10. Créer 9 Lines ---
  // Estimate 1
  await prisma.line.create({ data: { quantity: 1, description: 'Démontage et évacuation ancien équipement', price_per_qty: 500.0, subtotal: 500.0, estimate_id: estimate1.id, created_at: now, updated_at: now } });
  await prisma.line.create({ data: { quantity: 1, description: 'Installation nouvelle baignoire', price_per_qty: 1500.0, subtotal: 1500.0, estimate_id: estimate1.id, created_at: now, updated_at: now } });
  await prisma.line.create({ data: { quantity: 15, description: 'm² de carrelage au sol et mural', price_per_qty: 60.0, subtotal: 900.0, estimate_id: estimate1.id, created_at: now, updated_at: now } });

  // Estimate 2
  await prisma.line.create({ data: { quantity: 50, description: 'Mètres de câble électrique U1000 R2V', price_per_qty: 5.5, subtotal: 275.0, estimate_id: estimate2.id, created_at: now, updated_at: now } });
  await prisma.line.create({ data: { quantity: 10, description: 'Prises électriques et interrupteurs Legrand', price_per_qty: 15.0, subtotal: 150.0, estimate_id: estimate2.id, created_at: now, updated_at: now } });
  await prisma.line.create({ data: { quantity: 1, description: 'Tableau électrique 3 rangées', price_per_qty: 350.0, subtotal: 350.0, estimate_id: estimate2.id, created_at: now, updated_at: now } });

  // Estimate 3
  await prisma.line.create({ data: { quantity: 15, description: 'Mètres linéaires de maçonnerie', price_per_qty: 120.0, subtotal: 1800.0, estimate_id: estimate3.id, created_at: lastMonth, updated_at: lastMonth } });
  await prisma.line.create({ data: { quantity: 1, description: 'Fourniture et livraison des matériaux', price_per_qty: 300.0, subtotal: 300.0, estimate_id: estimate3.id, created_at: lastMonth, updated_at: lastMonth } });

  // Estimate 4
  await prisma.line.create({ data: { quantity: 1, description: 'Chaudière à condensation 25kW Bosch', price_per_qty: 3500.0, subtotal: 3500.0, estimate_id: estimate4.id, created_at: now, updated_at: now } });

  console.log('✅ 9 Lignes de devis créées');

  // --- 11. Créer 4 Invoices (Suppression de 'invoice_number' et 'payment_date') ---
  // Facture 1
  const invoice1 = await prisma.invoice.create({
    data: {
      object: 'Facture rénovation salle de bain',
      payment_type: 'bank_transfer',
      status: 'pending',
      estimate_id: estimate1.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'invoice_number' et 'payment_date'
    },
  });

  // Facture 2
  const invoice2 = await prisma.invoice.create({
    data: {
      object: 'Facture installation électrique',
      payment_type: 'credit_card',
      status: 'payed',
      estimate_id: estimate2.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'invoice_number' et 'payment_date'
    },
  });

  // Facture 3
  const invoice3 = await prisma.invoice.create({
    data: {
      object: 'Facture construction muret',
      payment_type: 'credit_card',
      status: 'payed',
      estimate_id: estimate3.id,
      created_at: new Date(lastMonth.getTime() + 15 * 24 * 60 * 60 * 1000),
      updated_at: new Date(lastMonth.getTime() + 20 * 24 * 60 * 60 * 1000),
      // Suppression de 'invoice_number' et 'payment_date'
    },
  });

  // Facture 4
  const invoice4 = await prisma.invoice.create({
    data: {
      object: 'Proforma remplacement chaudière',
      payment_type: 'bank_transfer',
      status: 'to_be_payed',
      estimate_id: estimate4.id,
      created_at: now,
      updated_at: now,
      // Suppression de 'invoice_number' et 'payment_date'
    },
  });

  console.log('✅ 4 Factures créées');

  // --- 12. Créer 4 Notifications ---
  const notification1 = await prisma.notification.create({
    data: { title: 'Nouveau projet assigné', body: 'Vous avez été assigné au projet de rénovation de salle de bain', created_at: now, updated_at: now },
  });

  const notification2 = await prisma.notification.create({
    data: { title: 'Devis validé', body: 'Votre devis pour l\'installation électrique a été validé', created_at: now, updated_at: now },
  });

  // Nouvelles notifications
  const notification3 = await prisma.notification.create({
    data: { title: 'Facture en attente', body: 'La facture FAC-2025-1001 pour la salle de bain est en attente de paiement', created_at: now, updated_at: now },
  });

  const notification4 = await prisma.notification.create({
    data: { title: 'Nouvelle tâche', body: 'Une nouvelle tâche a été créée sur le projet Rénovation Salle de bain: Pose Carrelage Mural', created_at: now, updated_at: now },
  });

  console.log('✅ 4 Notifications créées');

  // --- 13. Créer 8 UserReceivesNotifications ---
  // Notification 1
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification1.id, user_id: entreprise1.id, is_read: false, created_at: now, updated_at: now } });
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification1.id, user_id: customer1.id, is_read: true, created_at: now, updated_at: now } });
  // Notification 2
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification2.id, user_id: entreprise2.id, is_read: true, created_at: now, updated_at: now } });
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification2.id, user_id: customer2.id, is_read: false, created_at: now, updated_at: now } });
  // Notification 3 (Facture en attente)
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification3.id, user_id: customer1.id, is_read: false, created_at: now, updated_at: now } });
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification3.id, user_id: entreprise1.id, is_read: true, created_at: now, updated_at: now } });
  // Notification 4 (Nouvelle tâche)
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification4.id, user_id: entreprise1.id, is_read: false, created_at: now, updated_at: now } });
  await prisma.userReceivesNotifications.create({ data: { notification_id: notification4.id, user_id: customer1.id, is_read: false, created_at: now, updated_at: now } });

  console.log('✅ 8 UserReceivesNotifications créés');

  // --- 14. Créer 4 RefreshTokens ---
  await prisma.refreshToken.create({ data: { token_hash: 'hash_token_customer1_example', user_id: customer1.id, revoked: false, expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), created_at: now, updated_at: now } });
  await prisma.refreshToken.create({ data: { token_hash: 'hash_token_customer2_example', user_id: customer2.id, revoked: false, expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), created_at: now, updated_at: now } });
  await prisma.refreshToken.create({ data: { token_hash: 'hash_token_entreprise1_example', user_id: entreprise1.id, revoked: false, expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), created_at: now, updated_at: now } });
  await prisma.refreshToken.create({ data: { token_hash: 'hash_token_entreprise2_example', user_id: entreprise2.id, revoked: false, expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), created_at: now, updated_at: now } });

  console.log('✅ 4 RefreshTokens créés');

  console.log('');
  console.log('🎉 Seeding terminé avec succès et jeu de données adapté à votre schéma !');
  console.log('🔑 Credentials pour se connecter :');
  console.log('   Customer 1: customer1@test.com / Password123!');
  console.log('   Customer 2: customer2@test.com / Password123!');
  console.log('   Entreprise 1: entreprise1@test.com / Password123!');
  console.log('   Entreprise 2: entreprise2@test.com / Password123!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });