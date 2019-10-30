<h4>Backend</h4>
Använder en node express server som tidigare i denna kursen som vi även använt i vlinux kursen som lästs parallellt med denna kurs.
Det har gjort att man har haft hyffsad koll på vad som krävs och det har faktiskt känts stabilt.
Som bonus går det väldigt fort att sätta upp en server och få till några enkla routes.

Till skillnad mot tidigare kursmoment så valde jag att denna gången köra socket.io på min api server.
Det tog dock väldigt lång tid att lista ut varför det inte fungerade med app.listen.
När det väl va fixat så flöt det på väldigt fint och tycker den lösningen överlag är väldigt mycket cleanare.

Använder mig av mongoose istället för sqlite/mongodb som man använt i tidigare kursmoment.
Det är mest för att jag ville prova på mongoose ihop med scheman.
Tror dock det mer ställde till det än hjälpte.
Nollställer jag min databas så måste jag använda mig av min seeder för annars när jag skapar en användare så klagar den på mitt stocks fält.
Så gissar på att jag skulle kunna köra allt precis likadant fast utan schemat och ha en koll istället om det dom fälten finns hos varje användare.
Däremot fungerar det väldigt smidigt när man väl lagt in den första användaren och i en "riktig" server vill man nog ändå ha en admin användare att köra som default så det i sig känns inte som en nackdel.