import { Link } from "@remix-run/react";
import { ExternalLink } from "~/components/ExternalLink";
export { headers } from "~/utils/headers";

export default function CryptoDangers() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>Seriously, you don’t want to own Cryptocurrencies</h1>
      <p>This is not an <ExternalLink href='https://xkcd.com/538/'>original observation</ExternalLink>, but holding cryptocurrency makes you an amazing target for violent crime. The key properties of crypto (decentralisation, lack of trusted third parties, irrefutability, etc) are what make it so useful for criminals who want steal and/or exhort money. For this reason, among others, I, despite working for a crypto company, don’t hold any crypto assets and likely never will.</p>

      <h2>Some Horror Stories</h2>

      <blockquote className='classy-blockquote' cite="https://www.theguardian.com/world/2025/may/04/french-police-investigate-spate-of-cryptocurrency-millionaire-kidnappings">

        <p>French police are investigating a series of kidnappings of investors linked to cryptocurrency after a 60-year-old man had a finger chopped off by attackers who demanded his crypto-millionaire son pay a ransom.</p>

        <p>In the latest of several kidnappings of cryptocurrency figures in France and western Europe, the man, who owned a cryptocurrency marketing company with his son, was freed from a house south of Paris on Saturday night. He had been held for more than two days.</p>

        <p>One of the man’s fingers had been chopped off and investigators feared further mutilations could have happened if he had not been rescued.</p>

        <p>The man, who has not been publicly identified, was abducted in broad daylight at 10.30am on Thursday morning as he walked down a street in Paris’s 14th arrondissement. Four men in ski masks forced him into a delivery van.</p>
        <cite><ExternalLink href='https://www.theguardian.com/world/2025/may/04/french-police-investigate-spate-of-cryptocurrency-millionaire-kidnappings'>French police investigate spate of cryptocurrency millionaire kidnappings</ExternalLink></cite>
      </blockquote>


      <blockquote className='classy-blockquote' cite="https://www.vrt.be/vrtnws/en/2024/12/24/failed-kidnap-attempt-victim-was-bitcoin-millionaires-wife/">
        <p>David Balland, a co-founder of French crypto firm Ledger, had his hand mutilated while he and his wife were kidnapped, the Paris prosecutor said, adding that 10 people were being questioned following the freeing of the pair.
          Balland and his wife were kidnapped early on Tuesday morning from their home in central France, and were taken by car to two separate addresses where they were held captive</p>
        <cite><ExternalLink href='https://www.vrt.be/vrtnws/en/2024/12/24/failed-kidnap-attempt-victim-was-bitcoin-millionaires-wife/'>Failed kidnap attempt victim was Bitcoin millionaire’s wife</ExternalLink></cite>
      </blockquote>

      <blockquote cite="https://www.reuters.com/world/europe/kidnapped-co-founder-french-crypto-firm-ledger-had-his-hand-mutilated-2025-01-24/">
        <p>The identity has been revealed of the person, who was the subject of an attempted kidnap in Brussels last Friday. The abduction led to a police chase that ended in a crash in Bruges and the arrest of suspects. The victim, who was injured in the crash, has been identified as the wife of a ‘crypto-influencer’. Her husband had been keen to post on social media that he had become a millionaire by investing in crypto currencies. It’s thought his wife was possibly kidnapped to obtain ransom money.</p>
        <cite><ExternalLink href='https://www.reuters.com/world/europe/kidnapped-co-founder-french-crypto-firm-ledger-had-his-hand-mutilated-2025-01-24/'>Kidnapped co-founder of French crypto firm Ledger had his hand mutilated</ExternalLink></cite>
      </blockquote>



      <blockquote cite="https://www.vrt.be/vrtnws/en/2024/12/24/failed-kidnap-attempt-victim-was-bitcoin-millionaires-wife/">
        <p>Armed men are being hunted in Paris after a failed attempt to kidnap the daughter of a cryptocurrency entrepreneur and her two-year-old in the heart of the French capital.</p>
        <p>Video shot from nearby buildings and the street showed a violent struggle after three masked men descended from a delivery van in the Rue Pache in the 11th Arrondissement and grabbed the woman and her child.</p>
        <cite><ExternalLink href='https://www.thetimes.com/world/europe/article/france-paris-kidnap-company-head-daughter-dw8jx9ncv'>Gang tries to kidnap crypto tycoon’s daughter in central Paris</ExternalLink></cite>

      </blockquote>
    </div>
  );
}
