"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  filterInsights,
  isInsightCategory,
  type InsightCategoryId,
  type InsightSort,
} from "@/lib/insight-catalog";
import type { InsightCardData } from "@/lib/insights";
import { InsightCard } from "./InsightCard";
import styles from "./insights.module.css";

const PAGE_SIZE = 9;

type CategoryOption = {
  id: InsightCategoryId;
  label: string;
};

export function InsightDiscovery({
  articles,
  categories,
}: {
  articles: InsightCardData[];
  categories: readonly CategoryOption[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const category = isInsightCategory(categoryParam) ? categoryParam : "all";
  const sort: InsightSort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";
  const [query, setQuery] = useState("");
  const filterKey = `${category}|${sort}|${query}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const storedPage = pageState.key === filterKey ? pageState.page : 1;

  const results = useMemo(
    () => filterInsights(articles, { query, category, sort }),
    [articles, query, category, sort],
  );
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(storedPage, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);
  const filtersActive = query.trim().length > 0 || category !== "all" || sort !== "newest";

  function writeParams(next: { category?: InsightCategoryId | "all"; sort?: InsightSort }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextCategory = next.category ?? category;
    const nextSort = next.sort ?? sort;
    if (nextCategory === "all") params.delete("category");
    else params.set("category", nextCategory);
    if (nextSort === "newest") params.delete("sort");
    else params.set("sort", nextSort);
    params.delete("q");
    const queryString = params.toString();
    router.replace(queryString ? `/insights?${queryString}` : "/insights", { scroll: false });
  }

  function resetFilters() {
    setQuery("");
    router.replace("/insights", { scroll: false });
  }

  const countLabel =
    results.length === 0
      ? "No matching insights"
      : pageCount > 1
        ? `Showing ${start + 1}–${start + visible.length} of ${results.length}`
        : `${results.length} ${results.length === 1 ? "insight" : "insights"}`;

  return (
    <section
      id="article-discovery"
      className={`${styles.section} ${styles.sectionLight} ${styles.discovery}`}
      aria-labelledby="insight-discovery-title"
    >
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Explore Our Knowledge</p>
          <h2 id="insight-discovery-title">Explore the Topics That Matter.</h2>
          <p>Discover practical ideas and perspectives to help you navigate technology and digital business.</p>
        </header>
        <div className={styles.toolbar}>
          <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
            <SearchIcon />
            <label className="sr-only" htmlFor="insight-search">
              Search insights
            </label>
            <input
              id="insight-search"
              type="search"
              placeholder="Search insights..."
              value={query}
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button className={styles.clear} type="button" onClick={() => setQuery("")}>
                Clear
              </button>
            ) : null}
          </form>
          <label className="sr-only" htmlFor="insight-sort">
            Sort insights
          </label>
          <select
            id="insight-sort"
            className={styles.sort}
            value={sort}
            onChange={(event) => writeParams({ sort: event.target.value === "oldest" ? "oldest" : "newest" })}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className={styles.filters} role="toolbar" aria-label="Filter insights by category">
            <button
              className={styles.filter}
              type="button"
              aria-pressed={category === "all"}
              onClick={() => writeParams({ category: "all" })}
            >
              All Insights
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                className={styles.filter}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => writeParams({ category: item.id })}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.resultsBar}>
          <p aria-live="polite">{countLabel}</p>
          {filtersActive ? (
            <button className={styles.reset} type="button" onClick={resetFilters}>
              Reset filters
            </button>
          ) : null}
        </div>
        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((article) => (
              <InsightCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyResults}>
            <p>No insights match this search. Try a different keyword or clear the filters.</p>
            <button className={styles.primary} type="button" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        )}
        {pageCount > 1 ? (
          <nav className={styles.pager} aria-label="Insights pages">
            <button type="button" onClick={() => setPageState({ key: filterKey, page: currentPage - 1 })} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1;
              return (
                <button
                  key={number}
                  type="button"
                  aria-current={number === currentPage ? "page" : undefined}
                  onClick={() => setPageState({ key: filterKey, page: number })}
                >
                  {number}
                </button>
              );
            })}
            <button type="button" onClick={() => setPageState({ key: filterKey, page: currentPage + 1 })} disabled={currentPage === pageCount}>
              Next
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  );
}
