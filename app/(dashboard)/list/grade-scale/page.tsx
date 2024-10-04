import FormContainer from "@/components/form-container";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import TableSearch from "@/components/table-search";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { GradeScale, Prisma, School, Subject, ExamType } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type GradeScaleWithRelations = GradeScale & {
  school?: School;
  subject?: Subject;
};

const GradeScaleListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Letter Grade",
      accessor: "letterGrade",
    },
    {
      header: "Min Score",
      accessor: "minScore",
    },
    {
      header: "Max Score",
      accessor: "maxScore",
    },
    {
      header: "GPA",
      accessor: "gpa",
      className: "hidden md:table-cell",
    },
    
    {
      header: "Subject",
      accessor: "subject.name",
      className: "hidden md:table-cell",
    },
    {
      header: "Exam Type",
      accessor: "examType",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: GradeScaleWithRelations) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.name}</td>
      <td>{item.letterGrade}</td>
      <td>{item.minScore}</td>
      <td>{item.maxScore}</td>
      <td className="hidden md:table-cell">{item.gpa || "N/A"}</td>
      <td className="hidden md:table-cell">{item.subject?.name || "N/A"}</td>
      <td className="hidden md:table-cell">{item.examType || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="gradeScale" type="update" data={item} />
              <FormContainer table="gradeScale" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.GradeScaleWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "schoolId":
            query.schoolId = value;
            break;
          case "subjectId":
            query.subjectId = parseInt(value);
            break;
          case "examType":
            query.examType = value as ExamType;
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.gradeScale.findMany({
      where: query,
      include: {
        school: true,
        subject: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.gradeScale.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Grade Scales</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="gradeScale" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default GradeScaleListPage;