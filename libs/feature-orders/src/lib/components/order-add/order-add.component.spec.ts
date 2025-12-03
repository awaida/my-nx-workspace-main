import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderAddComponent } from './order-add.component';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrdersStore, API_CONFIG } from '@mini-crm/data-access';
import type { UpdateOrder } from '@mini-crm/data-access';

/**
 * Tests unitaires pour OrderAddComponent
 *
 * Ce fichier contient différents types de tests unitaires pour valider le comportement
 * du composant OrderAddComponent. Chaque type de test a un objectif spécifique :
 *
 * 1. TESTS DE CRÉATION (Smoke Tests)
 *    - Vérifient que le composant peut être instancié sans erreur
 *    - Objectif : Détecter les erreurs de compilation ou d'injection de dépendances
 *
 * 2. TESTS D'INTÉGRATION AVEC LES ENFANTS
 *    - Vérifient que le composant communique correctement avec OrderFormComponent
 *    - Objectif : Valider le binding des inputs/outputs et la projection de contenu
 *
 * 3. TESTS DE LOGIQUE MÉTIER (Unit Tests)
 *    - Vérifient le comportement des méthodes onSave() et onCancel()
 *    - Objectif : Valider la transformation des données et les appels au store
 *
 * 4. TESTS D'INTERACTION AVEC LE STORE
 *    - Vérifient que le composant appelle correctement OrdersStore.addOrder()
 *    - Objectif : Valider l'intégration avec la couche de gestion d'état
 *
 * 5. TESTS DE NAVIGATION
 *    - Vérifient le comportement de navigation (window.history.back())
 *    - Objectif : Valider le flux utilisateur après annulation
 *
 * 6. TESTS DE TRANSFORMATION DE DONNÉES
 *    - Vérifient la conversion UpdateOrder → CreateOrder dans onSave()
 *    - Objectif : Valider que l'ID est correctement retiré avant l'envoi au store
 */

describe('OrderAddComponent', () => {
  let component: OrderAddComponent;
  let fixture: ComponentFixture<OrderAddComponent>;
  let mockStore: {
    addOrder: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // ============================================
    // ARRANGE : Configuration du TestBed
    // ============================================
    // Création d'un mock du OrdersStore pour isoler le composant
    // et éviter les appels HTTP réels pendant les tests
    mockStore = {
      addOrder: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OrderAddComponent, OrderFormComponent],
      providers: [
        // Obligatoire pour Angular 20 zoneless
        provideZonelessChangeDetection(),
        // HttpClient nécessaire pour OrderFormComponent et ses dépendances (AuthService)
        provideHttpClient(),
        provideHttpClientTesting(),
        // Router nécessaire pour les tests de navigation
        provideRouter([]),
        // API_CONFIG nécessaire pour AuthService (dépendance de OrderFormComponent)
        {
          provide: API_CONFIG,
          useValue: { apiUrl: 'http://localhost:3000' },
        },
        // Fournir le mock du store au lieu du vrai store
        {
          provide: OrdersStore,
          useValue: mockStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderAddComponent);
    component = fixture.componentInstance;
  });

  // ============================================
  // TYPE 1 : TESTS DE CRÉATION (Smoke Tests)
  // ============================================
  // Ces tests vérifient que le composant peut être instancié sans erreur.
  // Ils sont essentiels car ils détectent rapidement les problèmes de :
  // - Injection de dépendances manquantes
  // - Erreurs de compilation TypeScript
  // - Problèmes de configuration du module de test
  describe('Création du composant', () => {
    it('devrait créer le composant sans erreur', async () => {
      // Act : Attendre que le composant soit stable (zoneless)
      await fixture.whenStable();

      // Assert : Vérifier que le composant existe
      expect(component).toBeTruthy();
    });

    it('devrait avoir le bon sélecteur', async () => {
      await fixture.whenStable();

      // Vérifier que le sélecteur  est correct
      // Cela garantit que le composant peut être utilisé dans les templates
      const element = fixture.nativeElement.querySelector('lib-order-add');
      expect(element).toBeTruthy();
    });
  });

  // ============================================
  // TYPE 2 : TESTS D'INTÉGRATION AVEC LES ENFANTS
  // ============================================
  // Ces tests vérifient que le composant communique correctement
  // avec OrderFormComponent via les inputs/outputs.
  // Ils valident :
  // - Le binding [order]="null" (mode création)
  // - Le binding (save)="onSave($event)"
  // - Le binding (canceled)="onCancel()"
  describe('Intégration avec OrderFormComponent', () => {
    it('devrait passer null à OrderFormComponent pour le mode création', async () => {
      // Act : Rendre le template
      await fixture.whenStable();

      // Assert : Vérifier que OrderFormComponent reçoit null
      const orderForm = fixture.nativeElement.querySelector('lib-order-form');
      expect(orderForm).toBeTruthy();

      // Vérifier que le composant enfant existe dans le DOM
      // (le binding [order]="null" est testé indirectement via le rendu)
    });

    it('devrait afficher le titre "Ajouter une commande"', async () => {
      await fixture.whenStable();

      // Assert : Vérifier que le titre est présent dans le template
      const title = fixture.nativeElement.querySelector('h2');
      expect(title).toBeTruthy();
      expect(title.textContent.trim()).toBe('Ajouter une commande');
    });
  });

  // ============================================
  // TYPE 3 : TESTS DE LOGIQUE MÉTIER
  // ============================================
  // Ces tests vérifient le comportement des méthodes du composant.
  // Ils valident :
  // - La transformation UpdateOrder → CreateOrder
  // - L'appel au store avec les bons paramètres
  // - La gestion des événements depuis OrderFormComponent
  describe('Méthode onSave()', () => {
    it("devrait convertir UpdateOrder en CreateOrder en retirant l'id", () => {
      // Arrange : Créer un UpdateOrder avec un ID (comme retourné par OrderFormComponent)
      const updateOrder: UpdateOrder = {
        id: 0, // OrderFormComponent peut retourner id: 0 pour les nouvelles commandes
        customer: 'Test Corp',
        nbDays: 5,
        tjm: 650,
        tauxTva: 20,
      };

      // Act : Appeler onSave avec un UpdateOrder
      component.onSave(updateOrder);

      // Assert : Vérifier que addOrder a été appelé avec un CreateOrder (sans id)
      expect(mockStore.addOrder).toHaveBeenCalledTimes(1);
      const callArgs = mockStore.addOrder.mock.calls[0][0];

      // Vérifier que l'objet passé ne contient pas l'id
      expect(callArgs.order).not.toHaveProperty('id');
      expect(callArgs.order).toEqual({
        customer: 'Test Corp',
        nbDays: 5,
        tjm: 650,
        tauxTva: 20,
      });

      // Vérifier que redirectTo est présent
      expect(callArgs.redirectTo).toBe('/orders');
    });

    it('devrait appeler store.addOrder avec redirectTo="/orders"', () => {
      // Arrange
      const updateOrder: UpdateOrder = {
        id: 0,
        customer: 'Another Corp',
        nbDays: 3,
        tjm: 500,
        tauxTva: 20,
      };

      // Act
      component.onSave(updateOrder);

      // Assert : Vérifier que le store est appelé avec le bon redirectTo
      expect(mockStore.addOrder).toHaveBeenCalledWith({
        order: expect.objectContaining({
          customer: 'Another Corp',
          nbDays: 3,
          tjm: 500,
          tauxTva: 20,
        }),
        redirectTo: '/orders',
      });
    });

    it('devrait gérer correctement un UpdateOrder avec tous les champs', () => {
      // Arrange : Tester avec tous les champs possibles
      const completeOrder: UpdateOrder = {
        id: 0,
        customer: 'Complete Corp',
        nbDays: 10,
        tjm: 700,
        tauxTva: 20,
      };

      // Act
      component.onSave(completeOrder);

      // Assert : Vérifier que tous les champs sont préservés sauf l'id
      expect(mockStore.addOrder).toHaveBeenCalledWith({
        order: {
          customer: 'Complete Corp',
          nbDays: 10,
          tjm: 700,
          tauxTva: 20,
        },
        redirectTo: '/orders',
      });
    });
  });

  // ============================================
  // TYPE 4 : TESTS D'INTERACTION AVEC LE STORE
  // ============================================
  // Ces tests vérifient que le composant interagit correctement
  // avec OrdersStore. Ils valident :
  // - Que les méthodes du store sont appelées avec les bons paramètres
  // - Que le store n'est pas appelé plusieurs fois par erreur
  // - Que les erreurs du store sont gérées (si applicable)
  describe('Interaction avec OrdersStore', () => {
    beforeEach(() => {
      // Réinitialiser le mock avant chaque test
      vi.clearAllMocks();
    });

    it('devrait appeler store.addOrder une seule fois lors de onSave()', () => {
      // Arrange
      const updateOrder: UpdateOrder = {
        id: 0,
        customer: 'Test',
        nbDays: 1,
        tjm: 100,
        tauxTva: 20,
      };

      // Act
      component.onSave(updateOrder);

      // Assert : Vérifier que addOrder n'est appelé qu'une seule fois
      expect(mockStore.addOrder).toHaveBeenCalledTimes(1);
    });

    it('ne devrait pas appeler store.addOrder lors de onCancel()', () => {
      // Arrange : S'assurer que le mock est vide
      expect(mockStore.addOrder).not.toHaveBeenCalled();

      // Act : Appeler onCancel (ne devrait pas toucher au store)
      component.onCancel();

      // Assert : Vérifier que le store n'a toujours pas été appelé
      expect(mockStore.addOrder).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // TYPE 5 : TESTS DE NAVIGATION
  // ============================================
  // Ces tests vérifient le comportement de navigation du composant.
  // Ils valident :
  // - Que window.history.back() est appelé lors de l'annulation
  // - Que la navigation fonctionne correctement
  describe('Méthode onCancel()', () => {
    it("devrait appeler window.history.back() lors de l'annulation", () => {
      // Arrange : Créer un spy sur window.history.back
      // Note : window.history.back() est une méthode native du navigateur
      // Dans un vrai test E2E, on utiliserait Playwright/Cypress
      // Ici, on teste juste que la méthode est appelée
      const historyBackSpy = vi.spyOn(window.history, 'back');

      // Act : Appeler onCancel
      component.onCancel();

      // Assert : Vérifier que window.history.back() a été appelé
      expect(historyBackSpy).toHaveBeenCalledTimes(1);

      // Nettoyer le spy après le test
      historyBackSpy.mockRestore();
    });

    it("devrait permettre à l'utilisateur de revenir en arrière", () => {
      // Arrange
      const historyBackSpy = vi.spyOn(window.history, 'back');

      // Act
      component.onCancel();

      // Assert : Vérifier que la navigation arrière est déclenchée
      expect(historyBackSpy).toHaveBeenCalled();

      historyBackSpy.mockRestore();
    });
  });

  // ============================================
  // TYPE 6 : TESTS DE TRANSFORMATION DE DONNÉES
  // ============================================
  // Ces tests vérifient que les données sont correctement transformées
  // avant d'être envoyées au store. Ils valident :
  // - La conversion UpdateOrder → CreateOrder
  // - La préservation de tous les champs sauf l'id
  // - La gestion des cas limites (id = 0, id négatif, etc.)
  describe('Transformation des données', () => {
    it("devrait retirer l'id même si celui-ci est 0", () => {
      // Arrange : OrderFormComponent peut retourner id: 0 pour les nouvelles commandes
      const updateOrderWithZeroId: UpdateOrder = {
        id: 0,
        customer: 'Zero ID Corp',
        nbDays: 2,
        tjm: 400,
        tauxTva: 20,
      };

      // Act
      component.onSave(updateOrderWithZeroId);

      // Assert : Vérifier que l'id (même 0) est retiré
      const callArgs = mockStore.addOrder.mock.calls[0][0];
      expect(callArgs.order).not.toHaveProperty('id');
      expect(callArgs.order.id).toBeUndefined();
    });

    it('devrait préserver tous les autres champs lors de la transformation', () => {
      // Arrange
      const updateOrder: UpdateOrder = {
        id: 999, // ID quelconque qui sera retiré
        customer: 'Preserve Corp',
        nbDays: 7,
        tjm: 750,
        tauxTva: 10, // Taux différent pour tester
      };

      // Act
      component.onSave(updateOrder);

      // Assert : Vérifier que tous les champs sont préservés
      const callArgs = mockStore.addOrder.mock.calls[0][0];
      expect(callArgs.order).toEqual({
        customer: 'Preserve Corp',
        nbDays: 7,
        tjm: 750,
        tauxTva: 10,
      });
    });

    it("devrait créer un nouvel objet CreateOrder sans muter l'original", () => {
      // Arrange : Créer un objet UpdateOrder
      const originalOrder: UpdateOrder = {
        id: 123,
        customer: 'Original Corp',
        nbDays: 5,
        tjm: 600,
        tauxTva: 20,
      };

      // Act
      component.onSave(originalOrder);

      // Assert : Vérifier que l'objet original n'a pas été modifié
      // (l'objet passé en paramètre doit rester intact)
      expect(originalOrder.id).toBe(123);
      expect(originalOrder.customer).toBe('Original Corp');

      // Vérifier que le store a reçu un nouvel objet sans id
      const callArgs = mockStore.addOrder.mock.calls[0][0];
      expect(callArgs.order.id).toBeUndefined();
    });
  });

  // ============================================
  // TYPE 7 : TESTS D'ISOLATION (Edge Cases)
  // ============================================
  // Ces tests vérifient le comportement dans des cas limites ou exceptionnels.
  // Ils valident :
  // - La gestion des valeurs nulles/undefined
  // - La robustesse du composant face aux erreurs
  describe('Cas limites', () => {
    it('devrait gérer correctement un UpdateOrder avec des valeurs minimales', () => {
      // Arrange : Tester avec les valeurs minimales possibles
      const minimalOrder: UpdateOrder = {
        id: 0,
        customer: 'A', // Nom minimal
        nbDays: 1, // Minimum
        tjm: 1, // Minimum
        tauxTva: 0, // Taux à 0%
      };

      // Act
      component.onSave(minimalOrder);

      // Assert : Vérifier que même avec des valeurs minimales, ça fonctionne
      expect(mockStore.addOrder).toHaveBeenCalledWith({
        order: {
          customer: 'A',
          nbDays: 1,
          tjm: 1,
          tauxTva: 0,
        },
        redirectTo: '/orders',
      });
    });
  });
});
