import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WordDialog } from 'src/app/dialogs/word/word-dialog.component';
import { Language } from 'src/app/_models/language.model';
import { Translation } from 'src/app/_models/translation.model';
import { Word } from 'src/app/_models/word.model';
import { LanguageService } from 'src/app/_services/language.service';
import { TranslationService } from 'src/app/_services/translation.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss'],
})
export class TranslationComponent implements OnInit {
  language: Language;
  form: FormGroup;
  mode = 'create';
  languageID: string;

  isLoading = false;
  sections: string[];
  selectedSection: string;

  translations: Word[] = [];
  translationColumns: string[] = ['section', 'key', 'value'];
  translationSource = new MatTableDataSource(this.translations);

  selectedTranslations: Word[] = [];
  selectedTranslationColumns: string[] = ['key', 'value', 'actions'];
  selectedTranslationSource = new MatTableDataSource(this.selectedTranslations);

  file: Translation;
  constructor(
    public languageService: LanguageService,
    public translationService: TranslationService,
    public route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      key: new FormControl(null, { validators: [Validators.required] }),
      fileName: new FormControl(null, { validators: [Validators.required] }),
    });

    this.translationService.getSections().subscribe((data) => {
      this.sections = data.sections;
      this.selectedSection = this.sections[0];
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('languageID')) {
        this.mode = 'edit';
        this.languageID = paramMap.get('languageID');
        this.isLoading = true;
        this.languageService
          .getByID(this.languageID)
          .subscribe((languageData) => {
            this.isLoading = false;
            this.language = languageData.language;
            this.form.controls['fileName'].disable();

            this.form.setValue({
              name: this.language.name,
              key: this.language.key,
              fileName: this.language.fileName,
            });

            this.translationService
              .getByKey(this.language.key)
              .subscribe((translationsData) => {
                this.file = translationsData.result;
                console.log(this.file);

                for (let section of this.sections) {
                  if (this.file.hasOwnProperty(section)) {
                    let resultArray = Object.keys(this.file[section]).map(
                      (index) => {
                        if (index) {
                          let word: Word = {
                            section: section,
                            key: index,
                            value: this.file[section][index],
                          };
                          return word;
                        }
                        return null;
                      }
                    );
                    this.translations = this.translations.concat(resultArray);
                    if (section === this.selectedSection) {
                      this.selectedTranslations = resultArray;
                      this.selectedTranslationSource = new MatTableDataSource(
                        this.selectedTranslations
                      );
                    }
                  }
                }
                this.translationSource = new MatTableDataSource(
                  this.translations
                );
              });
          });
      }
    });
  }

  onSaveTranslation() {
    this.isLoading = true;

    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    if (this.mode === 'create') {
      this.language = {
        _id: null,
        name: this.form.value.name,
        key: this.form.value.key,
        fileName: this.form.value.fileName,
      };

      this.languageService
        .create(this.language.name, this.language.key)
        .subscribe((result) => {
          if (result) {
            this.language = result.language;
            var fileName = this.language.fileName;
            var translation = this.mapTranslation(fileName);
            this.translationService.create(translation).subscribe((result) => {
              this.isLoading = false;
              if (result.status) {
                this.router.navigate(['/translations']);
              }
            });
          }
        });
    } else {
      this.form.controls['fileName'].enable();

      this.language = {
        _id: this.language._id,
        name: this.form.value.name,
        key: this.form.value.key,
        fileName: this.form.value.fileName,
      };
      this.languageService
        .update(this.language._id, this.language.name, this.language.key,this.language.fileName)
        .subscribe((result) => {
          if (result) {
            console.log(result);
            var fileName = this.language.fileName;
            var translation = this.mapTranslation(fileName);
            this.translationService
              .update(this.language._id, translation)
              .subscribe((result) => {
             this.isLoading = false;
                if (result.status) {
                 this.router.navigate(['/translations']);
                }
              });
          }
        });
    }
  }

  mapTranslation(fileName: string) {
    var translation: Translation = { fileName: fileName };
    for (let i = 0; i < this.translations.length; i++) {
      translation[this.translations[i].section] = {};
      translation[this.translations[i].section][this.translations[i].key] =
        this.translations[i].value;
    }
    return translation;
  }

  selectSection(section: string) {
    this.selectedTranslations = this.translations.filter(
      (translation) => translation.section === section
    );
    this.refreshTable();
  }

  refreshTable() {
    this.selectedTranslationSource = new MatTableDataSource(
      this.selectedTranslations
    );
    this.translationSource = new MatTableDataSource(this.translations);
  }

  onDeleteTranslation(word: Word) {
    this.translations = this.translations.filter((w) => w.key !== word.key);
    this.selectSection(word.section);
  }

  openTranslationDialog(word: Word) {
    var mode = 'update';

    if (!word) {
      mode = 'create';
      word = {
        section: this.selectedSection,
        key: null,
        value: null,
      };
    }

    const dialogRef = this.dialog.open(WordDialog, {
      width: '450px',
      data: {
        section: word.section,
        key: word.key,
        value: word.value,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'create') {
          this.translations.push(result);
        } else {
          var index = this.translations.indexOf(word);
          this.translations[index] = result;
        }
        this.selectSection(word.section);
      }
    });
  }
}
