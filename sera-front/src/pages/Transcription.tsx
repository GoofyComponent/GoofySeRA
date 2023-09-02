import { useQuery } from "@tanstack/react-query";
import { Check, CheckSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import srtParser2 from "srt-parser-2";

import { HeaderTitle } from "@/components/app/navigation/HeaderTitle";
import { Button } from "@/components/ui/button";
import { PlyrSection, RaptorPlyr } from "@/components/ui/plyrSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { axios } from "@/lib/axios";
import { SERA_JET_HEXA, SERA_PERIWINKLE_HEXA } from "@/lib/utils";

export const Transcription = () => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const plyrRef = useRef(null);

  const parser = new srtParser2();
  const srt_array = parser.fromSrt(SRT_EXEMPLE);

  const [isTranscriptValid, setIsTranscriptValid] = useState(false);
  const [displayedLine, setDisplayedLine] = useState("");

  useEffect(() => {
    console.log("◊srt_array", srt_array);
    if (plyrRef.current?.plyr.source === null) return;

    const setCurrentLine = () => {
      console.log("◊canPlay");
      const currentTime = plyrRef.current?.plyr.currentTime;
      const currentLine = srt_array.find(
        (objet) =>
          currentTime >= objet.startSeconds && currentTime <= objet.endSeconds
      );
      if (currentLine) {
        setDisplayedLine(currentLine.text);
      } else {
        setDisplayedLine("");
      }
    };

    plyrRef.current?.plyr.on("timeupdate", setCurrentLine);

    const offFuncs = () => {
      plyrRef.current?.plyr.off("timeupdate", setCurrentLine);
    };

    if (plyrRef?.current?.plyr?.source) {
      return offFuncs;
    }
  }, [plyrRef, plyrRef.current]);

  const {
    data: projectStepStatus,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["project-step-status", { ProjectId }],
    queryFn: async () => {
      const project = await axios.get(
        `/api/projects/${ProjectId}/steps?step=Planning`
      );
      return project.data[0].status;
    },
  });

  return (
    <>
      <HeaderTitle title="Transcription" previousTitle="Projet" />
      <div className="mx-6 flex flex-col justify-end">
        {isLoading && !isSuccess && (
          <p className="text-center italic">Loading...</p>
        )}
        {projectStepStatus != "done" && isSuccess && (
          <>
            <Button
              className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              disabled={!isTranscriptValid}
              onClick={() => {
                if (isTranscriptValid) {
                  console.log("isTranscriptValid");
                }
              }}
            >
              <Check />
              <p className="ml-2">Validate this step</p>
            </Button>
            {!isTranscriptValid && (
              <p className="my-auto text-gray-600">
                You can&apos;t validate this step until your team is complete
                and you have at least one reservation.
              </p>
            )}
          </>
        )}
        {projectStepStatus === "done" && isSuccess && (
          <div className="my-auto flex justify-center rounded-lg border-2 border-sera-jet text-center text-sera-jet">
            <CheckSquare size={32} className="my-auto mr-4" />
            <div className="flex flex-col justify-center text-center">
              <p className="font-bold">This step has been validated.</p>
              <p className="font-extralight italic">
                You can still update the information
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mx-6 flex justify-between">
        <section className="flex w-1/2 flex-col justify-evenly px-2">
          <h3 className="my-2 text-4xl font-medium text-sera-jet">
            Transcript file :
          </h3>
          {true ? <TranscriptFileCell /> : <NoTranscriptFileCell />}
        </section>
        <section className="w-1/2 px-2">
          <h3 className="my-2 text-4xl font-medium text-sera-jet">
            Video preview :
          </h3>
          <div
            className="mx-auto w-8/12 rounded-lg"
            style={{
              "--plyr-color-main": SERA_JET_HEXA,
              "--plyr-video-control-color": SERA_PERIWINKLE_HEXA,
            }}
          >
            <RaptorPlyr
              ref={plyrRef}
              source={videoData}
              className="rounded-lg"
            />
          </div>
        </section>
      </div>
      <Separator className="mx-auto my-4 h-0.5 w-11/12 bg-sera-jet/75" />
      <section id="srt-checker" className="mx-6">
        <h3 className="my-2 text-4xl font-medium text-sera-jet">
          SRT Viewer :
        </h3>
        <p className="my-6 w-full text-center text-7xl font-bold text-sera-jet">
          {displayedLine}
        </p>
      </section>
    </>
  );
};

const TranscriptFileCell = ({}: {}) => {
  return (
    <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-1 text-sera-jet">
      <div className="flex justify-between pb-2">
        <p className="my-2 text-xl font-bold ">Select a version</p>
        <button className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
          Upload a new SRT file
        </button>
      </div>

      <Select
        /*         defaultValue=""
         */ name="Transcript File Version"
        /*         value=""
         */ onValueChange={() => {}}
      >
        <SelectTrigger className="mb-1">
          <SelectValue placeholder="Select a file" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">File 1</SelectItem>
          <SelectItem value="2">File 2</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <p>You are seeing transcript file version 3</p>
        <p className="font-extralight italic">
          Uploaded on 2021-05-03 at 15:30 by John Doe
        </p>
      </div>
    </article>
  );
};

const NoTranscriptFileCell = () => {
  return (
    <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all">
      <p className="my-2 text-xl font-bold ">No file added</p>
      <p className="my-1 truncate text-lg ">
        You can add a file by clicking on the update button
      </p>
    </article>
  );
};

const SRT_EXEMPLE = `
1
00:00:00,330 --> 00:00:04,167
<i>Tous réunis, tous réunis</i>

2
00:00:04,251 --> 00:00:07,087
<i>Réunis entre amis</i>

3
00:00:08,255 --> 00:00:09,756
Non !

4
00:00:09,840 --> 00:00:10,924
Allez !

5
00:00:12,759 --> 00:00:14,344
LYCÉE EAST HIGH
100 ANS DE TRADITION

6
00:00:24,771 --> 00:00:26,315
- Désolé !
- Pardon.

7
00:00:27,691 --> 00:00:29,484
C'est bon, pas de problème.

8
00:00:33,030 --> 00:00:35,949
Super. Premier changement de costume.

9
00:00:40,037 --> 00:00:42,122
C'est le grand jour, Big Red.

10
00:00:42,205 --> 00:00:44,374
Grave ! Vive la première.

11
00:00:44,458 --> 00:00:47,127
À moi la moustache,
et plein d'autres choses.

12
00:00:47,210 --> 00:00:49,504
Non, je voulais parler de Nini.

13
00:00:49,588 --> 00:00:51,715
On va prendre un nouveau départ.

14
00:00:51,798 --> 00:00:53,383
Attends, j'ai des photos.

15
00:00:53,467 --> 00:00:55,677
Ça, c'est mon costume de l'acte 2.

16
00:00:55,761 --> 00:00:56,929
Impec, j'adore.

17
00:00:58,138 --> 00:01:00,807
Et la perruque qui glissait
quand je chantais.

18
00:01:00,891 --> 00:01:03,018
Ses textos sont neutres.

19
00:01:03,101 --> 00:01:06,021
Ni mauvaise nouvelle
ni grande discussion en vue.

20
00:01:06,104 --> 00:01:08,732
Seulement "Salut". C'est bon signe, non ?

21
00:01:10,192 --> 00:01:12,277
L'été, c'est une zone de non-droit.

22
00:01:12,361 --> 00:01:14,780
"Salut", on sait pas ce que ça veut dire.

23
00:01:14,863 --> 00:01:16,615
Je pense que c'est bon signe.

24
00:01:17,532 --> 00:01:19,117
Et ça...

25
00:01:19,201 --> 00:01:20,702
Je sais qui c'est.

26
00:01:20,786 --> 00:01:24,665
Meuf, je suis à deux doigts
d'en faire mon fond d'écran.

27
00:01:24,748 --> 00:01:26,583
Tu rayonnes, et c'est pas le soleil.

28
00:01:26,667 --> 00:01:29,544
C'est clair. J'ai passé un été de rêve.

29
00:01:29,628 --> 00:01:32,589
Et qui-tu-sais, il en dit quoi ?

30
00:01:32,673 --> 00:01:34,758
J'attends le bon moment pour lui dire.

31
00:01:34,841 --> 00:01:37,386
Salut Nini, ça roule ?

32
00:01:37,469 --> 00:01:38,804
C'est le moment.

33
00:01:41,765 --> 00:01:42,766
Salut.

34
00:01:46,728 --> 00:01:47,729
On peut parler ?

35
00:01:49,439 --> 00:01:51,441
C'est moi qui ai voulu un break.

36
00:01:51,525 --> 00:01:52,526
RICKY
PREMIÈRE

37
00:01:52,651 --> 00:01:54,653
Nini partait en colo de théâtre

38
00:01:54,736 --> 00:01:59,116
et franchement, je me sens pas menacé
par des mecs en collant.

39
00:01:59,199 --> 00:02:00,826
Je voulais pas d'une pause.

40
00:02:00,909 --> 00:02:01,910
NINI
PREMIÈRE

41
00:02:01,994 --> 00:02:03,745
On aurait pu s'appeler.

42
00:02:03,829 --> 00:02:06,999
Est-ce que j'ai été
avec d'autres filles, cet été ?

43
00:02:07,082 --> 00:02:08,083
C'est possible.

44
00:02:08,166 --> 00:02:10,669
Est-ce que je les ai soûlées avec Nini ?

45
00:02:11,587 --> 00:02:12,588
Carrément.

46
00:02:13,255 --> 00:02:14,715
J'ai rencontré quelqu'un.

47
00:02:14,798 --> 00:02:16,675
- Ça s'est fait...
- Tu rigoles ?

48
00:02:16,758 --> 00:02:18,385
- Je parle.
- Et bim !

49
00:02:19,219 --> 00:02:20,846
C'était en colo.

50
00:02:20,929 --> 00:02:22,723
Ça m'est tombé dessus comme ça.

51
00:02:22,806 --> 00:02:25,684
Il jouait le Music Man,
et moi, la bibliothécaire.

52
00:02:25,767 --> 00:02:26,977
Coup de foudre de scène.

53
00:02:27,060 --> 00:02:30,022
Une colo de bibliothécaire, ça existe ?

54
00:02:30,105 --> 00:02:32,774
Je t'en prie,
dis-moi que c'est une blague.

55
00:02:32,858 --> 00:02:33,984
- Non.
- Non.

56
00:02:34,901 --> 00:02:37,946
Arrête, Ricky !
Rappelle-toi ce que tu as fait.

57
00:02:38,697 --> 00:02:40,157
Ou pas fait.

58
00:02:40,782 --> 00:02:42,075
<i>Mes pieds puent ?</i>

59
00:02:42,659 --> 00:02:45,245
- J'ai l'intuition que oui.
- Non.

60
00:02:45,329 --> 00:02:46,955
6 SEMAINES PLUS TÔT

61
00:02:47,039 --> 00:02:48,123
Un peu.

62
00:02:48,206 --> 00:02:49,958
Je trouve ça mignon.

63
00:02:50,042 --> 00:02:51,835
On est faits pour s'entendre.

64
00:02:52,336 --> 00:02:54,630
- Regarde ton Instagram.
- Quoi ?

65
00:03:02,220 --> 00:03:04,640
<i>C'est presque notre anniversaire,</i>
<i>mon cœur !</i>

66
00:03:06,016 --> 00:03:08,143
<i>Je t'ai écrit une chanson.</i>

67
00:03:11,563 --> 00:03:14,149
- C'est quoi ?
- Regarde, c'est pour toi.

68
00:03:15,984 --> 00:03:17,569
- Regarde.
- Je regarde.

69
00:03:17,653 --> 00:03:20,822
<i>On a vécu des choses sans pareil</i>

70
00:03:20,906 --> 00:03:24,743
<i>Pendant que la Terre tournait</i>
<i>autour du soleil</i>

71
00:03:25,410 --> 00:03:28,830
<i>Hiver, printemps, été,</i>
<i>et revoilà l'automne</i>

72
00:03:29,581 --> 00:03:31,667
<i>Entre nous, rien ne dissone</i>

73
00:03:31,750 --> 00:03:33,043
Regarde.

74
00:03:33,126 --> 00:03:36,380
<i>Dès qu'on s'est embrassés</i>
<i>Mon cœur s'est emballé</i>

75
00:03:36,463 --> 00:03:40,259
<i>Et quand on a dansé</i>
<i>J'ai totalement perdu pied</i>

76
00:03:40,342 --> 00:03:44,221
<i>Cette année est bientôt révolue</i>

77
00:03:44,304 --> 00:03:48,350
<i>Et je referais bien des tours de soleil</i>
<i>Avec toi en continu</i>

78
00:03:48,433 --> 00:03:50,978
<i>En continu</i>

79
00:03:51,061 --> 00:03:53,689
<i>Je crois bien que je...</i>

80
00:03:55,232 --> 00:03:58,277
<i>Je crois bien que je...</i>

81
00:03:59,236 --> 00:04:01,697
<i>On est bien tous les deux</i>

82
00:04:02,948 --> 00:04:06,159
<i>On est tellement heureux</i>

83
00:04:06,243 --> 00:04:09,162
<i>Et j'aime...</i>
<i>Je crois bien que je...</i>

84
00:04:10,872 --> 00:04:12,874
<i>Je crois bien que je...</i>

85
00:04:12,958 --> 00:04:15,460
<i>Enfin, tu vois</i>

86
00:04:16,712 --> 00:04:19,756
<i>Je rêve tout le temps de toi</i>

87
00:04:20,465 --> 00:04:25,470
<i>On ne peut pas dire que je ne t'aime pas</i>

88
00:04:26,179 --> 00:04:30,350
<i>Tu vois, tu vois, tu vois...</i>

89
00:04:33,687 --> 00:04:34,938
C'est vrai, Ricky.

90
00:04:36,732 --> 00:04:38,150
Je t'aime.

91
00:04:44,281 --> 00:04:45,824
<i>Chers élèves, bonjour !</i>

92
00:04:45,907 --> 00:04:50,203
<i>Rendez-vous au gymnase</i>
<i>pour le traditionnel discours de rentrée.</i>

93
00:04:50,287 --> 00:04:52,039
J'y crois pas.

94
00:04:52,122 --> 00:04:54,499
Tu me jettes pour un théâtreux

95
00:04:54,583 --> 00:04:56,919
que t'as rencontré au bord d'un lac ?

96
00:04:57,002 --> 00:04:58,503
C'est toi qui m'as larguée !

97
00:04:58,587 --> 00:05:01,173
C'était un break, pas une rupture.

98
00:05:01,256 --> 00:05:02,257
Désolée, Ricky.

99
00:05:02,925 --> 00:05:04,426
C'est devenu une rupture.

100
00:05:05,385 --> 00:05:06,803
C'est bon, ça !

101
00:05:06,887 --> 00:05:09,139
- T'en mêle pas, Kourtney.
- La ferme.

102
00:05:09,222 --> 00:05:12,684
Je dézingue le patriarcat cette année,
et je commence par toi.

103
00:05:15,145 --> 00:05:16,146
T'as assuré.

104
00:05:16,229 --> 00:05:18,482
Ça aurait pas pu mieux se passer.

105
00:05:18,565 --> 00:05:19,650
<i>Je me sens bien.</i>

106
00:05:19,733 --> 00:05:22,736
C'est un nouveau départ,
les choses sont claires.

107
00:05:23,236 --> 00:05:24,571
C'est un cauchemar.

108
00:05:24,655 --> 00:05:27,407
Tout est moche, l'amour est mort.

109
00:05:27,491 --> 00:05:30,035
J'ai aussi le plaisir de vous annoncer

110
00:05:30,118 --> 00:05:35,457
que cette année, les terminale pourront
porter une casquette le vendredi.

111
00:05:35,540 --> 00:05:37,125
Allez, les terminale !

112
00:05:39,044 --> 00:05:40,504
Enfin, grande nouvelle.

113
00:05:41,129 --> 00:05:43,465
Nous avons une nouvelle prof de théâtre

114
00:05:43,548 --> 00:05:45,467
qui a un projet dont elle a juré,

115
00:05:45,550 --> 00:05:49,137
par écrit,
qu'il ne coûterait pas trop cher.

116
00:05:53,600 --> 00:05:56,520
Big Red, pourquoi
il faut toujours que tout change ?

117
00:05:57,145 --> 00:05:58,772
Tout ne change pas.

118
00:05:58,855 --> 00:06:00,857
Mes chaussettes, par exemple.

119
00:06:02,025 --> 00:06:03,652
Inutile d'applaudir.

120
00:06:06,196 --> 00:06:07,364
Allez, les Wildcats !

121
00:06:13,954 --> 00:06:16,999
Je suis mademoiselle Jenn.

122
00:06:17,916 --> 00:06:21,169
Quand j'ai su que le lycée
où le film a été tourné

123
00:06:21,253 --> 00:06:25,048
n'avait jamais monté la comédie musicale
<i>High School Musical</i>,

124
00:06:25,966 --> 00:06:29,094
la comédienne en moi a été choquée,

125
00:06:30,095 --> 00:06:33,724
la metteuse en scène, inspirée,
l'enfant des années 2000, motivée.

126
00:06:34,891 --> 00:06:35,934
Des années 2000 ?

127
00:06:36,018 --> 00:06:40,022
Les auditions ont lieu demain.
Ce spectacle peut changer votre vie.

128
00:06:40,105 --> 00:06:43,650
Croyez-en mon expérience
de danseuse sur le film d'origine.

129
00:06:44,234 --> 00:06:46,528
Dernier rang, 3e à gauche, bandeau rouge.

130
00:06:46,612 --> 00:06:49,323
Et oui, ce sont mes vraies dents.

131
00:06:50,240 --> 00:06:53,076
Voici l'élève chorégraphe, Carlos.

132
00:06:53,160 --> 00:06:55,287
Capitaine du lancer de drapeaux.

133
00:06:55,370 --> 00:06:58,707
Pour moi, une étoile montante sous-payée.

134
00:06:59,541 --> 00:07:01,168
Mais j'ai zéro budget.

135
00:07:02,711 --> 00:07:05,547
Je suis dans le chœur
depuis deux ans, ici.

136
00:07:05,631 --> 00:07:07,591
Ce serait fou de penser

137
00:07:07,674 --> 00:07:10,177
que j'ai une chance de jouer Gabriella.

138
00:07:11,887 --> 00:07:12,888
Pas vrai ?

139
00:07:19,728 --> 00:07:23,482
HIGH SCHOOL MUSICAL
LA COMÉDIE MUSICALE : LA SÉRIE

140
00:07:23,565 --> 00:07:25,067
LES AUDITIONS

141
00:07:27,235 --> 00:07:29,237
En tant qu'expert local du film,

142
00:07:29,321 --> 00:07:30,322
CARLOS
SECONDE

143
00:07:30,405 --> 00:07:31,740
je suis surexcité !

144
00:07:32,157 --> 00:07:34,159
<i>J'ai vu le premier film 37 fois,</i>

145
00:07:34,242 --> 00:07:36,870
et le premier quart d'heure
des deux autres.

146
00:07:42,209 --> 00:07:43,543
Excuse-moi.

147
00:07:44,378 --> 00:07:46,004
T'es pas attendu quelque part ?

148
00:07:47,381 --> 00:07:48,382
À Broadway.

149
00:07:50,008 --> 00:07:53,428
Je soutiens l'art.
J'ai un abonnement Spotify sans pub.

150
00:07:53,512 --> 00:07:55,055
M. MAZZARA
SCIENCES APPLIQUÉES

151
00:07:55,222 --> 00:07:58,016
Mais je préfère les préparer
au monde réel.

152
00:07:58,558 --> 00:07:59,559
C'est pas un crime.

153
00:08:00,060 --> 00:08:03,146
Je sais, maman.
Juste une mensualité de crédit auto.

154
00:08:03,230 --> 00:08:05,941
Je vais être payée que dans 15 jours.

155
00:08:08,944 --> 00:08:10,362
Super ! Pas toi, maman.

156
00:08:11,280 --> 00:08:13,949
Salut. Tu es encore nouvelle,
mais il faut donner

157
00:08:14,283 --> 00:08:16,743
une permission de sortir à ton assistant.

158
00:08:16,827 --> 00:08:20,664
Ça existe encore, ça ?
On est en prison ou quoi ?

159
00:08:21,164 --> 00:08:23,125
Non, dans un cadre professionnel.

160
00:08:23,208 --> 00:08:25,294
Chéri, je suis très professionnelle.

161
00:08:25,377 --> 00:08:28,088
Déjà, on n'appelle pas un collège "chéri".

162
00:08:28,171 --> 00:08:29,756
Toc toc, Mlle Jenn.

163
00:08:30,215 --> 00:08:31,592
Je vous annonce

164
00:08:31,675 --> 00:08:36,221
que le hashtag "High School Musical"
que j'ai lancé est déjà tendance.

165
00:08:36,305 --> 00:08:37,639
Ça ne m'étonne pas.

166
00:08:38,432 --> 00:08:41,435
Ta génération mérite
de s'approprier ce classique.

167
00:08:41,893 --> 00:08:43,020
Le monde vous regarde.

168
00:08:43,103 --> 00:08:46,148
Enfin, disons la région de Salt Lake City.

169
00:08:48,609 --> 00:08:49,901
Que ce soit clair.

170
00:08:49,985 --> 00:08:53,196
Cette prof
vit dans un monde fantasmé à la Hollywood

171
00:08:53,280 --> 00:08:55,240
où on est les Wildcats, mais non.

172
00:08:55,324 --> 00:08:56,533
On est les Léopards.

173
00:08:57,409 --> 00:08:58,577
Depuis toujours.

174
00:09:04,416 --> 00:09:05,918
J'ai dit à ma mère :

175
00:09:06,001 --> 00:09:10,213
"Être aussi canon tout en luttant
contre le sexisme et le racisme,

176
00:09:10,297 --> 00:09:12,007
"c'est ça, mon job d'été."

177
00:09:12,382 --> 00:09:14,051
Voilà mes grandes vacances.

178
00:09:15,844 --> 00:09:17,054
Elle est pas géniale ?

179
00:09:17,137 --> 00:09:19,181
- Tu es géniale.
- Merci.

180
00:09:20,307 --> 00:09:21,391
Idée folle :

181
00:09:21,475 --> 00:09:24,144
si on allait à l'audition costumés ?

182
00:09:24,227 --> 00:09:25,646
Je suis tout ouïe !

183
00:09:25,729 --> 00:09:27,773
Je m'occupe de ton maquillage.

184
00:09:27,856 --> 00:09:29,191
Je me disais,

185
00:09:29,274 --> 00:09:32,986
un maillot de basket pour moi,
et pour toi, ma jeune première,

186
00:09:33,070 --> 00:09:35,364
le total look Vanessa Hudgens.

187
00:09:35,447 --> 00:09:38,408
Non, ne nous emballons pas trop vite.

188
00:09:38,492 --> 00:09:43,246
Toi, tu seras Troy, c'est sûr.
Mais moi, je veux pas me porter la poisse.

189
00:09:43,455 --> 00:09:46,041
C'est pas très Nini 2.0, comme discours.

190
00:09:46,124 --> 00:09:48,126
Ma puce, on va pas l'un sans l'autre.

191
00:09:48,210 --> 00:09:51,755
Et les concurrentes sérieuses
ont eu leur diplôme en juin.

192
00:09:51,838 --> 00:09:53,298
Ces rôles sont à nous.

193
00:09:54,049 --> 00:09:56,551
Pourquoi on s'est pas connus plus tôt ?

194
00:09:59,346 --> 00:10:00,973
EJ, mon pote !

195
00:10:02,015 --> 00:10:03,058
Salut !

196
00:10:03,141 --> 00:10:04,309
Te voilà !

197
00:10:05,519 --> 00:10:08,647
C'est le meilleur, ou c'est le meilleur ?

198
00:10:08,730 --> 00:10:09,940
C'est vrai.

199
00:10:11,316 --> 00:10:13,318
- Mais...
- Pas de mais.

200
00:10:13,777 --> 00:10:15,821
Je veux pas que tu souffres encore.

201
00:10:15,904 --> 00:10:17,781
T'étais en vrac, après Ricky.

202
00:10:18,240 --> 00:10:20,284
En vrac, c'est un peu exagéré.

203
00:10:20,367 --> 00:10:22,744
T'as pas quitté ta chambre pendant 48 h.

204
00:10:22,828 --> 00:10:25,747
Je glissais de la pizza sous ta porte.
L'angoisse.

205
00:10:25,831 --> 00:10:28,250
C'est différent. Ça, c'était avant.

206
00:10:28,333 --> 00:10:31,253
Je suis solide, maintenant.

207
00:10:31,920 --> 00:10:32,921
Nini ?

208
00:10:34,339 --> 00:10:36,383
<i>Je l'ai repérée tout de suite.</i>

209
00:10:36,466 --> 00:10:37,467
<i>Il y a deux ans,</i>

210
00:10:37,551 --> 00:10:39,845
Nini jouait une vache dans <i>Gypsy.</i>

211
00:10:39,928 --> 00:10:40,929
EJ
TERMINALE

212
00:10:41,013 --> 00:10:42,806
Je l'ai trouvée trop mignonne,

213
00:10:42,889 --> 00:10:44,975
et elle méritait un vrai rôle.

214
00:10:45,058 --> 00:10:49,354
Et puis, il y a eu cet été.
Elle est totalement sortie de sa coquille.

215
00:10:49,438 --> 00:10:51,064
Et de son costume de vache.

216
00:10:51,315 --> 00:10:54,860
<i>Elle est extraordinaire,</i>
<i>elle est faite pour briller.</i>

217
00:10:55,527 --> 00:10:56,820
Mec, tu vois ça ?

218
00:10:56,903 --> 00:10:59,698
Je vois, j'entends, je hais.

219
00:11:00,490 --> 00:11:03,285
J'y crois pas, elle sort avec EJ Caswell.

220
00:11:03,368 --> 00:11:04,411
Ça va, j'ai vu.

221
00:11:05,162 --> 00:11:07,497
Capitaine de l'équipe de waterpolo.

222
00:11:07,581 --> 00:11:09,291
- Trésorier des terminale.
- Exact.

223
00:11:09,708 --> 00:11:12,878
C'est improbable que son mec de colo
soit dans ce lycée.

224
00:11:12,961 --> 00:11:15,213
Apparemment, c'est très probable.

225
00:11:15,923 --> 00:11:18,675
Désolé, mec. Qu'est-ce que tu vas faire ?

226
00:11:18,759 --> 00:11:19,760
J'en sais rien.

227
00:11:20,636 --> 00:11:23,722
Sans te vexer, ma confidente habituelle

228
00:11:23,805 --> 00:11:26,600
est en lune de miel
au milieu de la cafèt'.

229
00:11:41,365 --> 00:11:44,910
Si je peux dire un truc,
Nini est une chouette fille.

230
00:11:44,993 --> 00:11:45,994
NATALIE
SECONDE

231
00:11:46,078 --> 00:11:48,080
J'étais régisseuse sur <i>Brigadoon</i>,

232
00:11:48,163 --> 00:11:51,875
et Nini est la seule à m'avoir donné
une invit' pour la première.

233
00:11:51,959 --> 00:11:56,213
C'est généreux pour une fille
qui jouait le rôle d'un arbre.

234
00:11:56,296 --> 00:12:00,008
Mais comment un arbre
arrive à sortir avec un terminale ?

235
00:12:00,092 --> 00:12:01,218
<i>À toi, mamie.</i>

236
00:12:01,677 --> 00:12:03,136
Alors, cette rentrée ?

237
00:12:03,220 --> 00:12:06,848
La prof de théâtre a annoncé
la comédie musicale de cette année.

238
00:12:07,015 --> 00:12:08,308
Je rêve du 1er rôle.

239
00:12:08,475 --> 00:12:09,851
Ma star à moi !

240
00:12:10,560 --> 00:12:11,603
Merci.

241
00:12:12,437 --> 00:12:15,274
Mais je me suis endormie dans le bus,

242
00:12:15,357 --> 00:12:17,776
et j'ai fait un rêve que je fais souvent.

243
00:12:18,568 --> 00:12:20,237
C'est un rêve angoissant :

244
00:12:20,779 --> 00:12:24,032
je suis seule
sur une grande scène de Broadway,

245
00:12:24,116 --> 00:12:27,244
j'ouvre la bouche
et il n'y a rien qui sort.

246
00:12:27,327 --> 00:12:29,496
Oui, c'est un rêve très courant.

247
00:12:30,038 --> 00:12:32,124
Qu'est-ce qu'il veut dire ?

248
00:12:32,207 --> 00:12:36,169
Pas besoin d'une psychanalyste
pour décrypter.

249
00:12:36,253 --> 00:12:38,964
N'importe quelle grand-mère y arriverait.

250
00:12:39,047 --> 00:12:41,341
- Par chance, tu es les deux.
- Nini...

251
00:12:43,468 --> 00:12:47,723
L'idée de te faire entendre
semble être un interdit pour toi.

252
00:12:48,390 --> 00:12:49,850
Tu penses ne pas le mériter ?

253
00:12:50,892 --> 00:12:54,813
Je sais pas.
Comment on arrête de faire un rêve ?

254
00:12:55,355 --> 00:12:56,356
En le vivant.

255
00:12:57,357 --> 00:12:59,109
Pardon du retard !

256
00:12:59,943 --> 00:13:01,194
Coucou, maman D.

257
00:13:01,278 --> 00:13:03,238
Encore une panne de voiture.

258
00:13:03,322 --> 00:13:05,198
Devant le magasin de donuts !

259
00:13:05,282 --> 00:13:07,242
Merci, maman C.

260
00:13:07,326 --> 00:13:08,410
Quel est le score ?

261
00:13:08,493 --> 00:13:10,162
Mamie me laisse gagner.

262
00:13:10,954 --> 00:13:12,706
C'est toi qui gagnes, chérie.

263
00:13:13,749 --> 00:13:16,835
Oui, je veux bien
un donut vanille avec paillettes.

264
00:13:16,919 --> 00:13:19,963
- Merci de proposer !
- On partage !

265
00:13:22,424 --> 00:13:23,592
Je m'y prends mal.

266
00:13:24,134 --> 00:13:26,219
En cuisine, c'est pas un scoop.

267
00:13:26,303 --> 00:13:28,305
Le poulet cuit depuis 10 minutes,

268
00:13:28,388 --> 00:13:30,015
et il est plus froid qu'avant.

269
00:13:30,098 --> 00:13:31,099
Appelle maman.

270
00:13:31,183 --> 00:13:34,227
Bizarre.
J'ai appuyé sur le mauvais bouton ?

271
00:13:34,311 --> 00:13:37,314
- Appelle maman.
- On va pas l'embêter.

272
00:13:38,106 --> 00:13:39,858
Il est 21 h à Chicago.

273
00:13:39,942 --> 00:13:41,568
Elle sera pas en réunion.

274
00:13:42,319 --> 00:13:43,904
Bon, je l'appelle.

275
00:13:43,987 --> 00:13:47,074
Non ! Elle veut pas
que je la contacte, d'accord ?

276
00:13:49,034 --> 00:13:50,702
- Quoi ?
- Elle...

277
00:13:52,829 --> 00:13:57,125
Elle prolonge à Chicago
pour réfléchir un peu.

278
00:13:58,001 --> 00:13:59,336
Réfléchir à quoi ?

279
00:14:00,671 --> 00:14:03,423
Ça n'a rien à voir avec toi.

280
00:14:03,966 --> 00:14:04,967
Ça va s'arranger.

281
00:14:07,427 --> 00:14:09,513
Il est sérieux ou quoi ?

282
00:14:10,013 --> 00:14:12,516
Il devrait être dans l'avion pour Chicago,

283
00:14:13,308 --> 00:14:16,311
se battre pour sauver son couple !

284
00:14:20,440 --> 00:14:21,692
Ça a été, au lycée ?

285
00:14:23,485 --> 00:14:24,695
Ricky ?

286
00:14:29,241 --> 00:14:30,784
Non, pas question.

287
00:14:30,867 --> 00:14:34,746
C'est fou, je sais, mais il faut
qu'elle me voie sous un autre jour.

288
00:14:34,830 --> 00:14:37,958
- On déteste la comédie musicale.
- Je déteste pas ça.

289
00:14:38,041 --> 00:14:40,002
Mais c'est bizarre qu'un personnage

290
00:14:40,085 --> 00:14:42,212
se mette à chanter en pleine rue.

291
00:14:42,296 --> 00:14:43,922
C'est ça, la comédie musicale.

292
00:14:44,840 --> 00:14:48,218
Je vais passer l'audition demain.
Rien ne peut m'arrêter.

293
00:14:48,302 --> 00:14:51,805
- Tu sais de quoi parle le film ?
- Bien sûr !

294
00:14:52,055 --> 00:14:54,266
Zac Efron danse avec un ballon de basket.

295
00:14:54,474 --> 00:14:55,809
Non. Le héros, Troy,

296
00:14:55,892 --> 00:14:58,145
est tiraillé entre son pote Chad

297
00:14:58,228 --> 00:15:00,230
et son amour pour Gabriella.

298
00:15:01,273 --> 00:15:03,066
Comment tu sais tout ça ?

299
00:15:04,943 --> 00:15:07,613
Le film passe en boucle
chez mon allergologue.

300
00:15:08,447 --> 00:15:10,824
En tout cas, tu vises trop haut.

301
00:15:10,907 --> 00:15:12,117
Tu y arriveras pas.

302
00:15:13,368 --> 00:15:14,661
- Tu crois ?
- Oui.

303
00:15:18,248 --> 00:15:20,125
Et t'as pas la bonne coiffure !

304
00:15:24,087 --> 00:15:27,007
<i>Qui aurait pu prévoir...</i>

305
00:15:29,343 --> 00:15:31,011
<i>Jeunes gens, petit rappel :</i>

306
00:15:31,094 --> 00:15:34,389
<i>les auditions débutent dans l'auditorium</i>
<i>dans 5 minutes.</i>

307
00:15:34,473 --> 00:15:35,641
Allez !

308
00:15:38,060 --> 00:15:39,645
Un problème, M. Bowen ?

309
00:15:40,938 --> 00:15:44,441
Mettez bien en évidence
votre numéro de passage.

310
00:15:44,524 --> 00:15:45,734
C'est pas un jeu.

311
00:15:51,907 --> 00:15:55,243
Je suis un peu déçu
qu'on n'ait pas de concurrence.

312
00:15:55,327 --> 00:15:57,829
Ça aurait donné de la saveur
à la victoire.

313
00:15:57,913 --> 00:15:59,748
Arrête de faire le malin !

314
00:16:02,042 --> 00:16:04,294
Bon, t'as raison. C'est vrai.

315
00:16:07,214 --> 00:16:10,133
Allez, mes jeunes talents. En scène !

316
00:16:11,134 --> 00:16:12,135
Bonne chance !

317
00:16:12,219 --> 00:16:13,387
<i>Je comprends.</i>

318
00:16:13,470 --> 00:16:16,223
Qu'elle ait pas mis de costume.
Elle stresse.

319
00:16:17,182 --> 00:16:19,309
Elle a mis son sweat porte-bonheur.

320
00:16:20,352 --> 00:16:24,690
Même avec un sac à patates,
elle serait lumineuse.

321
00:16:24,773 --> 00:16:26,483
<i>Cinq, six, sept, huit !</i>

322
00:16:42,791 --> 00:16:44,126
Oui ! Bien, numéro 1 !

323
00:16:44,751 --> 00:16:46,712
- Canon.
- Oui, elle est géniale.

324
00:16:55,178 --> 00:16:56,597
Gare au coup de pied !

325
00:16:59,975 --> 00:17:02,352
Super ! C'est tout pour l'échauffement.

326
00:17:04,313 --> 00:17:05,522
Ça, l'échauffement ?

327
00:17:05,606 --> 00:17:08,233
Mettez-vous par deux. Pas avec un ami.

328
00:17:09,026 --> 00:17:10,402
Le théâtre est une famille.

329
00:17:12,154 --> 00:17:14,489
Salut ! Moi, c'est Nini.

330
00:17:14,573 --> 00:17:17,659
Impressionnant !
Tu veux bien me prêter tes jambes ?

331
00:17:17,743 --> 00:17:19,494
T'es trop mignonne !

332
00:17:20,245 --> 00:17:22,873
T'as déjà joué des premiers rôles, ici ?

333
00:17:22,956 --> 00:17:23,957
Non.

334
00:17:25,292 --> 00:17:27,794
Pas encore. Mais cet été en colo,

335
00:17:27,878 --> 00:17:31,340
j'ai remplacé au pied levé
la comédienne qui était malade.

336
00:17:31,882 --> 00:17:33,008
Passionnant !

337
00:17:33,091 --> 00:17:37,137
J'ai jamais été en colo,
et j'ai jamais été doublure.

338
00:17:37,679 --> 00:17:39,348
Faudra que tu me racontes !

339
00:17:40,015 --> 00:17:41,975
Gina, je suis en seconde.

340
00:17:42,059 --> 00:17:43,727
Je viens d'un autre lycée.

341
00:17:43,977 --> 00:17:44,978
On y retourne.

342
00:17:52,986 --> 00:17:56,949
Dès le deuxième jour,
tu casses déjà mon matériel neuf.

343
00:17:57,032 --> 00:17:59,201
À ma décharge, j'étudiais.

344
00:17:59,284 --> 00:18:00,369
Tu étudiais ?

345
00:18:00,786 --> 00:18:02,412
Troy dans <i>High School Musiccal.</i>

346
00:18:02,996 --> 00:18:04,081
Tu étudiais ça ?

347
00:18:04,998 --> 00:18:06,500
Tu perds ton temps,

348
00:18:06,583 --> 00:18:09,836
à vouloir ménager Mlle Jen
parce que Broadway l'a jetée.

349
00:18:09,920 --> 00:18:12,005
J'auditionne pas pour ça.

350
00:18:13,131 --> 00:18:15,259
Toi, tu vas briguer le rôle de Ryan.

351
00:18:15,801 --> 00:18:17,719
Toi, tu es très Taylor.

352
00:18:18,887 --> 00:18:21,515
Toi, tu es sans doute un Chad.

353
00:18:23,600 --> 00:18:24,810
Toi,

354
00:18:25,435 --> 00:18:28,939
tu dégages une profondeur rare.
Mme Darbus ?

355
00:18:30,065 --> 00:18:32,401
Je meurs. Oui !

356
00:18:33,277 --> 00:18:34,695
Tu joues du piano ?

357
00:18:34,778 --> 00:18:36,238
Je me débrouille.

358
00:18:36,321 --> 00:18:37,823
Tu écris des chansons ?

359
00:18:37,906 --> 00:18:40,325
Oui, mais je les ai jamais jouées.

360
00:18:40,409 --> 00:18:44,121
Pour moi, Mme Darbus
devrait avoir une ballade dans l'acte 2.

361
00:18:44,579 --> 00:18:45,581
On en reparle.

362
00:18:47,416 --> 00:18:49,251
- Gabriella.
- Voilà !

363
00:18:50,419 --> 00:18:52,462
C'est bon, je sais tout par cœur.

364
00:18:55,299 --> 00:18:56,842
100 % Troy, d'office.

365
00:18:58,594 --> 00:19:02,598
Et toi, si on te faisait auditionner
pour le rôle de Kelsi ?

366
00:19:09,605 --> 00:19:12,524
Gabriella.
Je veux auditionner pour Gabriella.

367
00:19:13,108 --> 00:19:14,109
D'accord.

368
00:19:16,695 --> 00:19:18,071
Ryan pour toi, pas vrai ?

369
00:19:18,155 --> 00:19:20,449
Je le verrais mieux en Sharpay.

370
00:19:22,326 --> 00:19:24,661
J'adore, c'est moderne.

371
00:19:25,245 --> 00:19:28,624
On pense qu'un prof de théâtre
est là pour monter un spectacle.

372
00:19:28,707 --> 00:19:30,042
Ce n'est pas faux.

373
00:19:30,125 --> 00:19:32,794
Mais avant tout, on sauve des vies.

374
00:19:33,629 --> 00:19:37,799
Les pauvres, les laissés-pour-compte
des terrains de sport,

375
00:19:38,592 --> 00:19:39,593
bienvenue.

376
00:19:42,804 --> 00:19:43,931
Mon cauchemar.

377
00:19:44,014 --> 00:19:47,643
Je dois vraiment y aller,
mais si vous éjectez le DVD,

378
00:19:47,726 --> 00:19:49,478
sachez que je l'ai emprunté.

379
00:19:50,270 --> 00:19:51,396
À la bibliothèque.

380
00:19:52,272 --> 00:19:53,774
En loucedé. Je file !

381
00:19:57,194 --> 00:19:58,737
Notre dernier Troy.

382
00:19:59,321 --> 00:20:01,865
Avec des accessoires, j'adore.

383
00:20:01,949 --> 00:20:03,200
Quand tu veux.

384
00:20:04,034 --> 00:20:05,077
Briefe-moi.

385
00:20:05,619 --> 00:20:06,787
EJ Caswell.

386
00:20:06,870 --> 00:20:08,455
Le plus suivi sur Instagram.

387
00:20:08,538 --> 00:20:09,998
Il est comme ça au réveil.

388
00:20:10,082 --> 00:20:11,583
Il sait pas que j'existe.

389
00:20:11,917 --> 00:20:13,627
J'espère qu'il sait chanter.

390
00:20:16,129 --> 00:20:21,134
<i>C'est peut-être le début</i>
<i>d'une belle histoire</i>

391
00:20:21,218 --> 00:20:25,764
<i>C'est si bien d'être ici avec toi</i>

392
00:20:27,307 --> 00:20:30,811
<i>Quand nos regards se croisent</i>

393
00:20:30,936 --> 00:20:34,773
<i>Mon cœur sait voir</i>

394
00:20:35,232 --> 00:20:41,154
<i>Que c'est peut-être le début</i>
<i>d'une belle histoire</i>

395
00:20:43,031 --> 00:20:45,075
Armie Hammer vient d'appeler.

396
00:20:45,200 --> 00:20:47,119
Tu lui as volé son joli menton !

397
00:20:48,704 --> 00:20:50,872
On passe aux Gabriella !

398
00:20:59,381 --> 00:21:04,720
<i>Je sais que quelque chose a changé</i>
<i>Qu'un sentiment est né...</i>

399
00:21:04,803 --> 00:21:08,599
Selon ma mère, si on est pas le meilleur,
ça vaut pas le coup.

400
00:21:08,682 --> 00:21:09,683
GINA
SECONDE

401
00:21:09,766 --> 00:21:11,852
Ça met pas du tout la pression.

402
00:21:12,519 --> 00:21:13,520
Pas du tout.

403
00:21:14,313 --> 00:21:18,358
<i>C'est peut-être le début</i>
<i>d'une belle histoire</i>

404
00:21:18,442 --> 00:21:22,529
<i>C'est si bien d'être ici avec toi</i>

405
00:21:23,989 --> 00:21:26,366
<i>Quand nos regards se croisent...</i>

406
00:21:26,450 --> 00:21:30,120
Un conseil de dernière minute
serait le bienvenu.

407
00:21:30,203 --> 00:21:31,538
Tu recommences.

408
00:21:32,414 --> 00:21:33,415
Quoi ?

409
00:21:33,498 --> 00:21:36,376
Tu prends un accent précieux
quand tu es stressée.

410
00:21:37,252 --> 00:21:38,921
Pourquoi je suis aussi godiche ?

411
00:21:39,004 --> 00:21:40,297
Écoute-moi.

412
00:21:40,380 --> 00:21:41,757
Tu vas assurer.

413
00:21:41,840 --> 00:21:44,301
Tu n'as aucune raison d'être stressée.

414
00:21:44,384 --> 00:21:47,638
Tu as endossé le rôle-titre
au pied levé, cet été.

415
00:21:47,721 --> 00:21:49,097
Sans rater une mesure.

416
00:21:49,181 --> 00:21:50,807
C'est à toi que tu le dois.

417
00:21:51,516 --> 00:21:52,601
Tu vas y arriver.

418
00:21:54,019 --> 00:21:57,064
Merci infiniment...
C'est pas vrai, je le refais !

419
00:21:57,147 --> 00:21:58,607
Oui, t'es foldingue.

420
00:21:58,982 --> 00:22:02,903
Et à cent pour cent authentique.
C'est pour ça que je t'aime.

421
00:22:05,072 --> 00:22:06,073
<i>C'est vrai, Ricky.</i>

422
00:22:08,075 --> 00:22:09,117
Je t'aime.

423
00:22:20,504 --> 00:22:22,047
Oui, c'est juste que...

424
00:22:24,424 --> 00:22:27,219
C'est une sacrée annonce publique.

425
00:22:31,139 --> 00:22:32,349
Écoute...

426
00:22:34,726 --> 00:22:36,144
J'ai réfléchi.

427
00:22:39,231 --> 00:22:42,276
Tu vas t'absenter pendant un mois.

428
00:22:43,402 --> 00:22:45,904
T'auras pas de réseau, dans la forêt.

429
00:22:45,988 --> 00:22:50,826
Peut-être qu'on devrait
calmer le jeu pendant un temps.

430
00:22:51,952 --> 00:22:54,413
Je sais pas, faire une petite pause.

431
00:22:58,208 --> 00:22:59,209
Une pause ?

432
00:23:00,168 --> 00:23:01,378
Oui.

433
00:23:01,461 --> 00:23:03,297
Je comprends tout à fait.

434
00:23:05,048 --> 00:23:07,092
Je dois répondre, c'est ma mère.

435
00:23:07,801 --> 00:23:10,762
Elle est en déplacement depuis longtemps.

436
00:23:15,142 --> 00:23:16,685
Je t'écris.

437
00:23:32,242 --> 00:23:33,410
Des infos sur elle ?

438
00:23:33,493 --> 00:23:35,370
Nina Salazar-Roberts.

439
00:23:35,454 --> 00:23:36,622
Gentille choriste.

440
00:23:36,705 --> 00:23:38,624
Joue des animaux et des arbres.

441
00:23:39,124 --> 00:23:41,209
Nini, c'est quand tu veux.

442
00:23:42,961 --> 00:23:44,713
J'arrive trop tard ?

443
00:23:46,840 --> 00:23:49,051
On a assez de Troy, on manque de Chad.

444
00:23:49,134 --> 00:23:50,636
Après les Gabriella.

445
00:23:50,719 --> 00:23:53,847
J'ai appris que les scènes de Troy
dans le film.

446
00:23:53,931 --> 00:23:55,307
Troy aurait été à l'heure.

447
00:23:56,391 --> 00:23:58,352
Merci, je prends le relais.

448
00:23:58,435 --> 00:24:00,771
Nini, on y retourne.

449
00:24:00,854 --> 00:24:02,022
Vas-y, mon cœur !

450
00:24:08,820 --> 00:24:09,988
Pas de panique !

451
00:24:10,697 --> 00:24:14,952
Nini, on attend que la lumière revienne.
Ne sois pas déstabilisée.

452
00:24:18,747 --> 00:24:19,748
Non, ça va.

453
00:24:24,211 --> 00:24:27,798
<i>Je vivais dans un monde à part</i>

454
00:24:28,465 --> 00:24:31,551
<i>Incapable de voir</i>

455
00:24:33,011 --> 00:24:36,139
<i>Que rien n'est impossible</i>

456
00:24:37,057 --> 00:24:40,435
<i>Si on prend des risques</i>

457
00:24:41,603 --> 00:24:44,523
<i>Jamais je n'ai pu croire</i>

458
00:24:45,649 --> 00:24:48,443
<i>En ce que je ne pouvais voir</i>

459
00:24:49,695 --> 00:24:52,614
<i>Jamais je n'avais ouvert mon cœur</i>

460
00:24:53,490 --> 00:24:56,743
<i>À toutes ces possibilités</i>

461
00:24:57,828 --> 00:25:01,873
<i>Je sais que quelque chose a changé</i>

462
00:25:01,957 --> 00:25:04,001
<i>Qu'un sentiment est né</i>

463
00:25:04,084 --> 00:25:06,003
<i>Et ici ce soir</i>

464
00:25:06,086 --> 00:25:10,424
<i>C'est peut-être le début</i>
<i>d'une belle histoire</i>

465
00:25:10,507 --> 00:25:14,428
<i>C'est si bien d'être ici avec toi</i>

466
00:25:15,971 --> 00:25:19,182
<i>Quand nos regards se croisent</i>

467
00:25:19,266 --> 00:25:22,853
<i>Mon cœur sait voir</i>

468
00:25:22,936 --> 00:25:24,771
<i>Que c'est le début d'une histoire</i>

469
00:25:24,855 --> 00:25:29,943
<i>J'ignorais que ça existait</i>
<i>Jusqu'au jour où je t'ai rencontré</i>

470
00:25:33,530 --> 00:25:38,869
<i>J'étais aveugle auparavant</i>
<i>Mais j'y vois clair à présent</i>

471
00:25:43,081 --> 00:25:47,002
<i>C'est le début d'une belle histoire</i>

472
00:25:47,085 --> 00:25:50,964
<i>C'est si bien d'être ici avec toi</i>

473
00:25:52,466 --> 00:25:55,552
<i>Quand nos regards se croisent</i>

474
00:25:55,636 --> 00:25:58,972
<i>Mon cœur sait voir</i>

475
00:25:59,431 --> 00:26:02,517
<i>Que c'est le début d'une belle histoire</i>

476
00:26:07,898 --> 00:26:08,941
Bien.

477
00:26:09,316 --> 00:26:10,484
Merci, Nini.

478
00:26:10,943 --> 00:26:14,529
Je ne voulais que 32 mesures,
mais j'apprécie ton engagement.

479
00:26:15,197 --> 00:26:16,865
Toi, le retardataire !

480
00:26:17,324 --> 00:26:18,325
Viens faire Chad.

481
00:26:37,803 --> 00:26:40,013
Bonjour, je m'appelle Ricky Bowen.

482
00:26:40,973 --> 00:26:42,182
Je suis en première.

483
00:26:45,143 --> 00:26:46,144
C'est parti.

484
00:26:46,520 --> 00:26:47,896
Il sort de nulle part.

485
00:26:49,189 --> 00:26:50,607
"Je comprends pas, Troy.

486
00:26:52,276 --> 00:26:55,237
"Quel sort t'a jeté
cette tentatrice surdouée

487
00:26:55,320 --> 00:26:57,781
"pour t'embarquer
dans une comédie musicale ?"

488
00:27:07,457 --> 00:27:08,458
J'en sais rien.

489
00:27:09,835 --> 00:27:13,213
Peut-être parce que Gabriella
t'a toujours soutenu.

490
00:27:14,548 --> 00:27:16,800
Et tu peux pas t'empêcher

491
00:27:17,217 --> 00:27:19,803
de te maudire
d'avoir tout gâché avec elle.

492
00:27:19,886 --> 00:27:21,138
C'était dans le film ?

493
00:27:21,221 --> 00:27:23,056
Et tu sais, Troy,

494
00:27:24,016 --> 00:27:27,144
même si tu n'as pas dit
tes sentiments à Gabriella,

495
00:27:27,811 --> 00:27:32,190
parce que c'est un truc
que tes parents se disent plus jamais,

496
00:27:34,484 --> 00:27:36,737
ça veut pas dire que tu éprouves rien.

497
00:27:37,362 --> 00:27:40,324
C'est peut-être que tu attendais
le bon moment,

498
00:27:41,158 --> 00:27:42,743
pour que le monde l'entende.

499
00:27:49,041 --> 00:27:50,500
Pour qu'elle l'entende.

500
00:27:57,299 --> 00:27:58,926
Allez, jeune homme, chante.

501
00:27:59,009 --> 00:28:01,595
Ça vous ennuie pas ?
J'ai une chanson à moi.

502
00:28:02,930 --> 00:28:04,014
D'accord.

503
00:28:25,619 --> 00:28:26,954
J'y crois pas !

504
00:28:28,288 --> 00:28:31,416
<i>On a vécu des choses sans pareil</i>

505
00:28:31,500 --> 00:28:35,545
<i>Pendant que la Terre</i>
<i>tournait autour du soleil</i>

506
00:28:35,629 --> 00:28:39,424
<i>Hiver, printemps, été,</i>
<i>et revoilà l'automne</i>

507
00:28:40,259 --> 00:28:42,928
<i>Entre nous, rien ne dissone</i>

508
00:28:43,011 --> 00:28:47,099
<i>C'est que trois petits mots</i>
<i>Rien de bien méchant</i>

509
00:28:47,182 --> 00:28:51,186
<i>De toute façon,</i>
<i>je ne peux pas empêcher mes sentiments</i>

510
00:28:51,270 --> 00:28:54,773
<i>Je pense que tu as compris</i>
<i>où je voulais en venir</i>

511
00:28:55,524 --> 00:28:58,986
<i>Mais au cas où,</i>
<i>voici ce que je veux te dire</i>

512
00:28:59,069 --> 00:29:01,405
<i>Voici ce que je veux te dire...</i>

513
00:29:01,989 --> 00:29:04,866
<i>Je crois bien que je...</i>

514
00:29:05,701 --> 00:29:08,870
<i>Je crois bien que je...</i>

515
00:29:09,538 --> 00:29:12,332
<i>On est bien tous les deux</i>

516
00:29:13,250 --> 00:29:15,836
<i>On est tellement heureux</i>

517
00:29:15,919 --> 00:29:19,506
<i>Et j'aime...</i>
<i>Je crois bien que je...</i>

518
00:29:20,632 --> 00:29:24,303
<i>Enfin, tu vois...</i>

519
00:29:26,138 --> 00:29:28,682
<i>On peut parler des jours entiers</i>

520
00:29:29,474 --> 00:29:33,145
<i>Sans jamais être à court de sujets</i>

521
00:29:33,228 --> 00:29:36,189
<i>C'est rare, une telle complicité</i>

522
00:29:36,648 --> 00:29:39,443
<i>On est bien accordés</i>

523
00:29:40,819 --> 00:29:43,071
<i>Je crois bien que je...</i>

524
00:29:44,281 --> 00:29:47,993
<i>Je crois bien que je...</i>

525
00:29:48,076 --> 00:29:50,704
<i>Je crois bien que je...</i>

526
00:29:51,538 --> 00:29:55,250
<i>Je crois bien que je...</i>

527
00:29:56,835 --> 00:29:59,671
<i>Je rêve tout le temps de toi</i>

528
00:30:00,422 --> 00:30:04,259
<i>On ne peut pas dire</i>
<i>que je ne t'aime pas...</i>

529
00:30:06,178 --> 00:30:12,267
<i>Tu vois, tu vois, tu vois...</i>

530
00:30:20,859 --> 00:30:23,737
Hashtag "retour en fanfare".

531
00:30:24,947 --> 00:30:26,698
Ça, c'est fait.

532
00:30:26,782 --> 00:30:27,908
C'était bien.

533
00:30:31,453 --> 00:30:32,746
Pourquoi tu es venu ?

534
00:30:33,997 --> 00:30:35,540
Pour l'audition.

535
00:30:36,083 --> 00:30:38,627
- Tu hais les comédies musicales.
- T'es dure.

536
00:30:38,710 --> 00:30:41,546
Pendant <i>The Greatest Showman</i>,
tu criais sur l'écran :

537
00:30:41,630 --> 00:30:43,674
"C'est pas crédible !"

538
00:30:43,757 --> 00:30:45,175
C'était à l'époque.

539
00:30:45,717 --> 00:30:49,721
Maintenant, je trouve
les comédies musicales trop géniales.

540
00:30:51,390 --> 00:30:55,269
D'accord. À mon tour de te dire
comment j'étais, à l'époque.

541
00:30:56,228 --> 00:30:59,064
À l'époque, tu m'as brisé le cœur.

542
00:31:00,190 --> 00:31:03,527
Et puis, je suis partie
et je me suis trouvée.

543
00:31:03,610 --> 00:31:05,529
Tu peux pas te pointer à nouveau

544
00:31:06,363 --> 00:31:07,614
pour essayer

545
00:31:09,241 --> 00:31:10,575
de tout embrouiller.

546
00:31:10,659 --> 00:31:12,786
Tu crois que je suis là pour ça ?

547
00:31:13,412 --> 00:31:15,247
Non, Nini.

548
00:31:15,914 --> 00:31:18,917
J'ai toujours cru en toi, en nous.

549
00:31:19,751 --> 00:31:22,170
Même si j'étais trop nul pour l'exprimer.

550
00:31:23,130 --> 00:31:24,923
C'est pour ça que je suis là.

551
00:31:25,007 --> 00:31:26,883
Poussez-vous !

552
00:31:26,967 --> 00:31:28,343
Carlos affiche la liste !

553
00:31:28,802 --> 00:31:31,555
On ne peut pas dire que je ne t'aime pas.

554
00:31:34,850 --> 00:31:39,313
Avant, les profs attendaient 2 ou 3 jours
pour annoncer la distribution.

555
00:31:39,563 --> 00:31:41,982
Mais quand on sait, on sait.

556
00:31:42,065 --> 00:31:43,900
Ça s'appelle l'instinct.

557
00:31:47,821 --> 00:31:51,116
<i>Et dans le doute,</i>
<i>il faut miser sur les outsiders.</i>

558
00:31:57,039 --> 00:31:58,081
Félicitations.

559
00:31:58,874 --> 00:32:02,169
- Chad ? Je suis Chad ?
- C'est rien.

560
00:32:12,846 --> 00:32:14,139
La vache, mec.

561
00:32:16,058 --> 00:32:18,143
TROY : RICKY BOWEN
DOUBLURE : EJ CASWELL

562
00:32:26,902 --> 00:32:28,570
<i>Préparez-vous, les Wildcats.</i>

563
00:32:28,654 --> 00:32:30,906
Ça va chauffer.

564
00:32:33,533 --> 00:32:35,035
<i>Cinq, six, sept, huit !</i>

565
00:32:41,124 --> 00:32:43,043
<i>Tiré des films</i>
<i>écrits par Peter Barsocchini</i>

566
00:33:06,441 --> 00:33:08,318
- Allez qui ?
- Les Wildcats !

567
00:33:08,402 --> 00:33:10,237
- Allez qui ?
- Les Wildcats !

568
00:33:10,320 --> 00:33:12,155
- Allez qui ?
- Les Wildcats !

569
00:33:53,113 --> 00:33:55,115
Sous-titres : Anaïs Duchet


`;

const videoData = {
  type: "video",
  title: "bunny",
  sources: [
    {
      size: 1080,
      provider: "html5",
      src: "https://destroykeaum.alwaysdata.net/assets/other/sample.mp4",
      type: "video/mp4",
    },
  ],
};
