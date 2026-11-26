import type { Root } from "hast"
import { Content } from "./index"
import { QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

const Markdown = Content()
const home = "index" as FullSlug
const writing = "writing/index" as FullSlug

export function SiteHeading({ fileData, allFiles, cfg }: QuartzComponentProps) {
  const name = allFiles.find((file) => file.slug === home)?.frontmatter?.title ?? cfg.pageTitle
  const isHome = fileData.slug === home
  const Tag = isHome ? "h1" : "div"
  return (
    <>
      <Tag class="signature">
        ~*~ © {name} ~*~{" "}
        <span class="cursor" aria-hidden="true">
          █
        </span>
      </Tag>
      {!isHome && <h1>{fileData.frontmatter?.title}</h1>}
    </>
  )
}

export function BackLink({ fileData }: QuartzComponentProps) {
  const slug = fileData.slug!
  if (slug === home) return null
  const toHome = slug === writing
  return (
    <p>
      <a href={resolveRelative(slug, toHome ? home : writing)}>{toHome ? "← Home" : "← Writing"}</a>
    </p>
  )
}

export function NoteBody(props: QuartzComponentProps) {
  if (
    props.tree.type === "root" &&
    !(props.tree as Root).children.length &&
    props.fileData.frontmatter?.description
  ) {
    return (
      <article>
        <p>{props.fileData.frontmatter.description}</p>
      </article>
    )
  }
  return <Markdown {...props} />
}

function chapter(value: unknown) {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

export function WritingFolder(props: QuartzComponentProps) {
  const { fileData, allFiles } = props
  const slug = fileData.slug!
  const prefix = slug.slice(0, -"index".length)
  const notes = allFiles.filter(
    (file) => file.slug?.startsWith(prefix) && !file.slug.endsWith("/index"),
  )
  const groups = new Map<string, typeof notes>()
  for (const note of notes) {
    const folder = note.slug!.slice(0, note.slug!.lastIndexOf("/") + 1)
    const group = groups.get(folder) ?? []
    group.push(note)
    groups.set(folder, group)
  }
  return (
    <>
      <Markdown {...props} />
      {Array.from(groups.keys())
        .sort()
        .map((folder) => {
          const title =
            allFiles.find((file) => file.slug === folder + "index")?.frontmatter?.title ??
            folder.slice(0, -1).split("/").pop()?.replaceAll("-", " ")
          const entries = groups.get(folder)!.sort((a, b) => {
            const order =
              (chapter(a.frontmatter?.chapter) ?? Infinity) -
              (chapter(b.frontmatter?.chapter) ?? Infinity)
            return order || (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "")
          })
          return (
            <section key={folder}>
              {folder !== prefix && <h2 class="collection-title">{title}</h2>}
              <ul class="chapter-list">
                {entries.map((note) => {
                  const number = chapter(note.frontmatter?.chapter)
                  return (
                    <li key={note.slug}>
                      {number && <span class="chapter">{String(number).padStart(2, "0")}</span>}
                      <a href={resolveRelative(slug, note.slug!)}>{note.frontmatter?.title}</a>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
    </>
  )
}
