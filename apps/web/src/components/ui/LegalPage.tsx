import { PageHeader } from "@/components/ui/PageHeader";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: string[] }[] }) {
  return (
    <>
      <PageHeader title={title} crumbs={[{ label: title }]} subtitle={`Сүүлд шинэчилсэн: ${updated}`} />
      <article className="container-page max-w-3xl space-y-8 py-12">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-lg font-bold text-navy">{s.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-ink/80">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </>
  );
}
