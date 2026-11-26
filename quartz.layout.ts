import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { BackLink, SiteHeading } from "./quartz/components/PersonalSite"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [BackLink],
  footer: () => null,
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [SiteHeading],
  left: [],
  right: [],
}

export const defaultListPageLayout = defaultContentPageLayout
