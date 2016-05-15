from django.db import models
import csv


class Crypth(models.Model):
    source_text = models.CharField(max_length=1500)
    step = models.PositiveSmallIntegerField()
    final_text = models.CharField(max_length=1500, blank=True)
    method = models.CharField(max_length=25)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __unicode__(self):
        return self.final_text

    def __init__(self, source_text, step, method):
        models.Model.__init__(self)
        self.source_text = source_text
        self.step = step
        self.method = method
        self.final_text = ''

        def work_with_step(symbol, onstep):
            if method == "encrypt":
                return symbol + onstep
            elif method == "decrypt":
                return symbol - onstep

        for (i, letter) in enumerate(source_text):
            ascii_letter_source = ord(letter)

            if 64 < ascii_letter_source < 91:
                ascii_letter_final = work_with_step(ascii_letter_source, step)
                if ascii_letter_final > 90:
                    ascii_letter_final -= 26
                elif ascii_letter_final < 65:
                    ascii_letter_final += 26

            elif 96 < ascii_letter_source < 123:
                ascii_letter_final = work_with_step(ascii_letter_source, step)
                if ascii_letter_final > 122:
                    ascii_letter_final -= 26
                elif ascii_letter_final < 97:
                    ascii_letter_final += 26
            else:
                ascii_letter_final = ascii_letter_source
            self.final_text += chr(ascii_letter_final)

    def writeCSV(self):
        with open('Crypts.csv', 'a+') as csvFile:
            writer = csv.writer(csvFile, delimiter=';')
            source_text_formated = self.source_text.replace('\n', '/newline/')
            final_text_formated = self.final_text.replace('\n', '/newline/')
            writer.writerow([source_text_formated, self.method, self.step, final_text_formated])
