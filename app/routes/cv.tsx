export default function CV() {
  // The most outrageous tailwind classes I ever wrote.
  return (
    <div className="p-4 leading-tight max-w-4xl mx-auto pt-10 [&:not(:last-child)]:*:mb-8 [&:not(:last-child)]:*:pb-8 [&:not(:last-child)]:*:border-b-2">
      <Profile />

      <WorkHistory />

      <Education />
    </div>
  );
}

const Profile = () => (
  <div className="grid grid-cols-5 gap-4 ">
    <h1 className="col-span-5 md:col-span-1 my-0 text-3xl">John Whiles</h1>
    <p className="col-span-3 text-base">
      I am a product-minded software engineer with 7 years of experience working
      at high-growth companies. I prefer to work across the full stack and
      deliver features end-to-end. I built the micro SaaS app{" "}
      <a
        className="not-italic font-sans text-base"
        href="https://www.coachtracker.net"
      >
        Coachtracker
      </a>{" "}
      and write regularly on my{" "}
      <a
        className="not-italic font-sans text-base"
        href="https://johnwhiles.com/"
      >
        personal website
      </a>
      .
    </p>
    <ul className="my-0 list-none">
      <li>
        <a href="https://github.com/jwhiles">Github</a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/john-whiles/">LinkedIn</a>
      </li>
      <li>
        <a href="https://johnwhiles.com">Website</a>
      </li>
      <li>
        <a href="mailto:cv@johnwhiles.com">Email</a>
      </li>
    </ul>
  </div>
);

const workHistory: WorkEntryProps[] = [
  {
    companyName: "Contentful",
    jobTitle: "Senior Software Engineer",
    startDate: "March 2023",
    endDate: "September 2023",
    description: (
      <ul className="my-0 [&>*]:my-2 [&>*]:text-sm">
        <li>
          Managed Contentful’s fleet of Postgres database. Including leading a
          project to perform major version upgrades across the entire fleet with
          zero downtime for customers.
        </li>
        <li>
          Extensive contributions to Contentful’s app framework, which is
          heavily used by enterprise customers.
        </li>
        <li>
          Rebuilt the front-end technical interview, improving the experience
          for interviewers and candidates.
        </li>
        <li>Helped to on board various other engineers to the company</li>
      </ul>
    ),
  },
  {
    companyName: "Soundcloud",
    jobTitle: "Frontend Engineer",
    startDate: "2019-06",
    endDate: "2020-03",
    description: (
      <ul className="my-0 [&>*]:my-2 [&>*]:text-sm">
        <li>Implemented the ability to tag other users in comments.</li>
        <li>
          Improved page load times on an internal admin tool by multiple orders
          of magnitude.
        </li>
      </ul>
    ),
  },
  {
    companyName: "Habito",
    jobTitle: "Senior Software Engineer",
    startDate: "2018-07",
    endDate: "2019-06",
    description: (
      <ul className="my-0 [&>*]:my-2 [&>*]:text-sm">
        <li>
          As a team of two, completed a rebuild of Habito's design system and
          styling, including building a design system, which improved the
          accessibility of the product.
        </li>
        <li>
          Implemented the dynamic mortgage interview, which is the core of
          Habito's user journey.
        </li>
      </ul>
    ),
  },
  {
    companyName: "Trainline",
    jobTitle: "Senior Software Engineer",
    startDate: "2018-01",
    endDate: "2018-07",
    description: (
      <ul className="my-0 [&>*]:my-2 [&>*]:text-sm">
        <li>
          Replatformed one of The Trainline's busiest services from C# to
          Node.js, improving performance and maintainability.
        </li>
        <li>Improved The Trainline's internal design system.</li>
      </ul>
    ),
  },
  {
    companyName: "Just Giving",
    jobTitle: "Senior Software Engineer",
    startDate: "2017-03",
    endDate: "2018-01",
    description: (
      <ul className="my-0 [&>*]:my-2 [&>*]:text-sm">
        <li>Built a rich UI for a new financial reporting service.</li>
        <li>Maintained our design system's component library.</li>
        <li>
          Led a TypeScript migration. Ensured that our builds continued to work,
          and helped the rest of the team get used to TypeScript.
        </li>
      </ul>
    ),
  },
];

interface WorkEntryProps {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: React.ReactNode;
}
const WorkHistory = () => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 md:col-span-2">
        <h2 className="my-0 text-3xl">Work</h2>
      </div>
      <ol className="col-span-9 md:col-span-7">
        {workHistory.map((x) => (
          <WorkEntry key={x.companyName} {...x} />
        ))}
      </ol>
    </div>
  );
};

const WorkEntry = ({
  companyName,
  jobTitle,
  startDate,
  endDate,
  description,
}: WorkEntryProps) => {
  return (
    <div className="grid grid-cols-6 gap-8 mb-4 last:mb-0">
      <div className="col-span-2">
        <h3 className="mt-0 mb-1 text-xl">{companyName}</h3>
        <p className="mb-1 text-sm">{jobTitle}</p>
        <p className="text-xs">
          {startDate} - {endDate}
        </p>
      </div>

      <div className="col-span-4">{description}</div>
    </div>
  );
};

const Education = () => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 md:col-span-2">
        <h2 className="my-0 text-3xl">Education</h2>
      </div>

      <ol className="col-span-9 md:col-span-7">
        <div className="grid grid-cols-6 gap-8 mb-4">
          <div className="col-span-2">
            <h3 className="mt-0 mb-1 text-xl">Founders and Coders</h3>
            <p className="text-xs mb-0">2016 - 2017</p>
          </div>

          <div className="col-span-4">Student developer</div>
        </div>

        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-2">
            <h3 className="mt-0 mb-1 text-xl">
              Royal Holloway, University of London
            </h3>
            <p className="text-xs mb-0">2010 - 2013</p>
          </div>

          <div className="col-span-4">BA Politics with Philosophy (2:1)</div>
        </div>
      </ol>
    </div>
  );
};

// const Skills = () => {
//   return (
//     <div className="grid grid-cols-9 gap-4">
//       <div className="col-span-2">
//         <h2 className="my-0 text-3xl">Skills</h2>
//       </div>

//       <ol className="col-span-7">
//         <li>TypeScript</li>
//         <li>React</li>
//       </ol>
//     </div>
//   );
// };
