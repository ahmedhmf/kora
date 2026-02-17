import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SURVEY_QUESTIONS, SURVEY_SECTIONS, SurveyQuestion } from './survey-data';
import { trigger, transition, style, animate, query, stagger, group } from '@angular/animations';

type Language = 'en' | 'ar' | 'de';

@Component({
    selector: 'app-survey',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './survey.component.html',
    styleUrl: './survey.component.css',
    animations: [
        trigger('slideCard', [
            transition(':increment', [
                style({ position: 'relative', overflow: 'hidden' }),
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 2
                    })
                ], { optional: true }),
                query(':enter', [
                    style({ transform: 'translateX(100%)', opacity: 0 })
                ], { optional: true }),
                group([
                    query(':leave', [
                        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
                    ], { optional: true }),
                    query(':enter', [
                        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(0%)', opacity: 1 }))
                    ], { optional: true })
                ])
            ]),
            transition(':decrement', [
                style({ position: 'relative', overflow: 'hidden' }),
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 2
                    })
                ], { optional: true }),
                query(':enter', [
                    style({ transform: 'translateX(-100%)', opacity: 0 })
                ], { optional: true }),
                group([
                    query(':leave', [
                        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
                    ], { optional: true }),
                    query(':enter', [
                        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(0%)', opacity: 1 }))
                    ], { optional: true })
                ])
            ])
        ]),
        trigger('staggerFadeIn', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    stagger(100, [
                        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ]),
        trigger('fadeOutIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class SurveyComponent {
    currentLanguage = signal<Language | null>(null);
    currentStep = signal(0); // 0 is language selection
    answers = signal<Record<string, any>>({});

    sections = SURVEY_SECTIONS;
    questions = SURVEY_QUESTIONS;

    isRTL = computed(() => this.currentLanguage() === 'ar');

    setLanguage(lang: Language) {
        this.currentLanguage.set(lang);
        this.currentStep.set(1);
    }

    getSectionQuestions(sectionId: number): SurveyQuestion[] {
        return this.questions.filter(q => q.section === sectionId);
    }

    nextSection() {
        if (this.currentStep() < this.sections.length) {
            this.currentStep.update(s => s + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.log('Survey Final Answers:', this.answers());
            this.currentStep.set(99); // Completed state
        }
    }

    prevSection() {
        if (this.currentStep() > 1) {
            this.currentStep.update(s => s - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.currentLanguage.set(null);
            this.currentStep.set(0);
        }
    }

    updateAnswer(questionId: string, value: any) {
        this.answers.update(a => ({ ...a, [questionId]: value }));
    }

    isQuestionAnswered(questionId: string): boolean {
        const answer = this.answers()[questionId];
        if (Array.isArray(answer)) return answer.length > 0;
        return answer !== undefined && answer !== '';
    }

    canGoNext(): boolean {
        const currentSectionQuestions = this.getSectionQuestions(this.currentStep());
        // For simplicity, let's keep it optional but encourage answers
        return true;
    }

    toggleMulti(questionId: string, value: string) {
        const current = this.answers()[questionId] || [];
        const index = current.indexOf(value);
        if (index > -1) {
            this.updateAnswer(questionId, current.filter((v: string) => v !== value));
        } else {
            this.updateAnswer(questionId, [...current, value]);
        }
    }

    getProgress(): number {
        if (this.currentStep() === 0) return 0;
        if (this.currentStep() === 99) return 100;
        return (this.currentStep() / this.sections.length) * 100;
    }
}
