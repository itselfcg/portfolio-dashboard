import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation-dialog.component';
import { Language } from 'src/app/_models/language.model';
import { LanguageService } from 'src/app/_services/language.service';
@Component({
  selector: 'app-translation-home',
  templateUrl: './translation-home.component.html',
  styleUrls: ['./translation-home.component.scss'],
})
export class TranslationHomeComponent implements OnInit {
  isLoading = false;
  private languageSub: Subscription = new Subscription();
  languages: Language[] = [];
  languagesDataSource = new MatTableDataSource(this.languages);

  languageColumns: any[] = ['id', 'name', 'key', 'fileName', 'actions'];
  constructor(
    public languageService: LanguageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.languageService.getAll();
    this.languageSub = this.languageService
      .getLanguageUpdateListener()
      .subscribe((data: Language[]) => {
        this.languages = data;
        this.refreshDataSource();
        this.isLoading = false;
      });
  }

  onDeleteTranslation(id: string) {
    var message = {
      title: 'Confirmation',
      content: 'Are you sure you want to delete this translation?',
      falseOption: '',
      trueOption: 'OK',
    };
    this.dialog
      .open(ConfirmationDialog, {
        data: message,
      })
      .afterClosed()
      .subscribe((confirmation: Boolean) => {
        if (confirmation) {
          this.languageService.delete(id).subscribe(
            () => {
              this.languageService.getAll();
              this.languageSub = this.languageService
                .getLanguageUpdateListener()
                .subscribe((data: Language[]) => {
                  this.languages = data;
                  this.refreshDataSource();
                  this.isLoading = false;
                });
            },
            () => {
              this.isLoading = false;
            }
          );
        }
      });
  }

  refreshDataSource() {
    this.languagesDataSource = new MatTableDataSource(this.languages);
  }
}
