import { Component } from '@angular/core';

@Component({
  selector: 'app-registration-page',
  template: `
    <div class="registration-page">
      <h1>Utwórz profil dietetyka</h1>
      <h4>
        Profil dietetyka umożliwia nawiązywanie współprac z użytkownikami aplikacji, monitorowanie ich postępów oraz dzienników żywieniowych.
      </h4>
      <h5>
        Aby utworzyć profil dietetyka, musisz posiadać konto użytkownika aplikacji Omniom.
        Utworzenie profilu dietetyka jest bezpłatne.

        W przypadku posiadania dokumentów potwierdzających kwalifikacje dietetyczne, możesz je przesłać w celu weryfikacji.
        Po weryfikacji, Twój profil dietetyka zostanie oznaczony jako zweryfikowany.
      </h5>
      <p>Wypełnij poniższe pola, aby utworzyć konto dietetyka</p>
      <form>
        <mat-form-field>
          <input matInput placeholder="Imię">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Nazwisko">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Numer telefonu">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Miasto">
        </mat-form-field>
        <mat-form-field>
          <input type="file" placeholder="Skany dokumentów">
        </mat-form-field>
        <button mat-raised-button color="primary">Utwórz konto</button>
      </form>

    </div>

  `,
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {

}
