Feature: Card creation

  En tant qu’utilisateur connecté,
  je souhaite pouvoir créer des fiches qui seront intégrées
  dans le système en catégorie 1.

  Scenario: Card creation for the Category 1
    When I open the "Boîtes" page
    And I type "Capitale de la France ?" in the field "Question"
    And I type "Paris" in the field "Answer"
    And I click on the "Créer la carte" button
    Then the card "Capitale de la France ?" is in the Category 1