import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { absoluteUrlSafe } from '@/lib/seo';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Licence',
  description:
    'Comment utiliser les produits achetés chez One More Click Studio : usages autorisés, droits commerciaux et restrictions de redistribution.',
  alternates: { canonical: absoluteUrlSafe('/license') },
};

const MATRIX = [
  { right: 'Utiliser dans vos propres expériences Roblox', standard: true, commercial: true },
  { right: 'Modifier, recolorer et étendre les fichiers', standard: true, commercial: true },
  { right: 'Utiliser dans un jeu monétisé / commercial', standard: true, commercial: true },
  { right: 'Utiliser sur un nombre illimité de vos projets', standard: false, commercial: true },
  { right: 'Utiliser dans un travail client rémunéré', standard: false, commercial: true },
  { right: 'Redistribuer les fichiers sources', standard: false, commercial: false },
  { right: 'Revendre le produit, modifié ou non', standard: false, commercial: false },
  { right: 'Partager les fichiers publiquement ou en groupe', standard: false, commercial: false },
  { right: 'Inclure les fichiers dans un autre pack', standard: false, commercial: false },
];

export default function LicensePage() {
  return (
    <LegalPage
      title="Licence des produits numériques"
      intro="Ce que vous pouvez faire — et ne pas faire — avec les fichiers achetés. Chaque fiche produit indique la licence applicable avant l’achat."
    >
      <LegalSection title="En résumé">
        <p>
          Vous achetez une licence d’<strong>utilisation</strong> des fichiers, pas leur propriété.
          Construisez ce que vous voulez avec, dans vos propres jeux. Ne transmettez jamais les
          fichiers eux-mêmes à qui que ce soit, sous quelque forme que ce soit, payante ou gratuite.
        </p>
      </LegalSection>

      <LegalSection title="Comparaison des licences">
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70">
                <th className="px-4 py-3 text-left font-medium text-ink">Droit</th>
                <th className="px-4 py-3 text-center font-medium text-ink">Standard</th>
                <th className="px-4 py-3 text-center font-medium text-ink">Commerciale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {MATRIX.map((row) => (
                <tr key={row.right}>
                  <td className="px-4 py-3 text-ink-muted">{row.right}</td>
                  <td className="px-4 py-3 text-center">
                    <Mark allowed={row.standard} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Mark allowed={row.commercial} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Certains produits portent une <strong>licence personnalisée</strong> avec des conditions
          propres. Lorsqu’elle existe, elle est affichée sur la fiche produit et prime sur cette page.
        </p>
      </LegalSection>

      <LegalSection title="Vous pouvez">
        <LegalList
          items={[
            'Utiliser le produit dans les expériences Roblox que vous possédez et exploitez, y compris monétisées.',
            'Modifier, recolorer, redimensionner, reconstruire et combiner les assets avec votre propre travail.',
            'Publier un jeu contenant le produit, dès lors que le produit est un composant du jeu et non l’objet distribué.',
            'Continuer à utiliser le produit indéfiniment, y compris après la fin de votre accès à la boutique.',
            'Télécharger toutes les versions publiées sous la licence achetée.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Vous ne pouvez pas">
        <LegalList
          items={[
            'Redistribuer, partager, téléverser ou publier les fichiers sources — y compris sur un serveur Discord, dans un groupe, un dépôt public ou un hébergeur de fichiers.',
            'Revendre le produit, qu’il soit inchangé, modifié, renommé ou reconditionné.',
            'Inclure les fichiers dans un autre pack, modèle ou produit destiné à la distribution.',
            'Sous-licencier, louer ou céder votre licence à une autre personne ou un autre studio sans autorisation écrite.',
            'Utiliser le produit pour entraîner un modèle génératif, ou constituer une bibliothèque d’assets concurrente.',
            'Revendiquer la paternité des assets originaux.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Usage en équipe ou en studio">
        <p>
          La licence standard couvre un développeur travaillant sur ses propres projets. Si
          plusieurs personnes ont besoin des fichiers sources, ou si le travail est destiné à un
          client, une licence commerciale est requise. Publier un jeu fini contenant le produit
          n’est pas de la redistribution — envoyer le .rbxm à un coéquipier, si.
        </p>
      </LegalSection>

      <LegalSection title="Mention de l’auteur">
        <p>
          Aucune mention n’est obligatoire, sauf indication contraire sur la fiche produit. Elle
          reste appréciée — un crédit dans la description de votre jeu aide d’autres créateurs à
          nous trouver.
        </p>
      </LegalSection>

      <LegalSection title="Application">
        <p>
          Les liens de téléchargement sont personnels et rattachés à votre achat. Les partager, ou
          partager les fichiers qu’ils délivrent, peut entraîner la révocation de votre licence sans
          remboursement et le retrait de votre accès à la boutique.
        </p>
      </LegalSection>

      <LegalSection title="Aucune affiliation avec Roblox Corporation">
        <p>
          {SITE.name} est un studio de création indépendant. Il n’est ni affilié à Roblox
          Corporation, ni approuvé ou sponsorisé par elle. Les produits vendus ici sont destinés à
          Roblox Studio et restent soumis aux conditions d’utilisation et aux standards
          communautaires de Roblox, qui priment sur tout ce qui figure sur cette page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function Mark({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Check className="mx-auto size-4 text-success" strokeWidth={3} />
  ) : (
    <X className="mx-auto size-4 text-danger" strokeWidth={3} />
  );
}
