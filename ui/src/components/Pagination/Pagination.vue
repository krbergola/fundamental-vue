// We are using v-for in the template below. // This is possible but requires
that each element in the template // to be uniquely keyed. // see:
https://forum.vuejs.org/t/v-for-on-templates/8359/2

<template>
  <div class="fd-pagination" @keydown="keyHandler">
    <span v-if="displayTotal" class="fd-pagination__total"
      >{{ itemsTotal }} {{ formattedTotalText }}</span
    >
    <nav class="fd-pagination__nav">
      <a
        href="#"
        class="fd-pagination__link fd-pagination__link--previous"
        aria-label="Previous"
        :aria-disabled="selectedPage === 1"
        @click.prevent="navigateBack"
      />
      <template v-for="page in pages">
        <a
          v-if="page.type === 'normal'"
          :key="`page-link-${page.number}`"
          href="#"
          class="fd-pagination__link"
          :aria-selected="selectedPage === page.number + 1"
          @click.prevent="pageClicked"
          >{{ page.number + 1 }}</a
        >
        <span
          v-else
          :key="`page-more-${page.number}`"
          class="fd-pagination__link fd-pagination__link--more"
          aria-hidden="true"
          aria-label="…"
          role="presentation"
        />
      </template>
      <a
        href="#"
        class="fd-pagination__link fd-pagination__link--next"
        aria-label="Next"
        :aria-disabled="selectedPage === numberOfPages"
        @click.prevent="navigateForward"
      />
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PropValidator } from "vue/types/options";

type PageType = "invisbile" | "normal" | "more";

type Page = {
  number: number;
  type: PageType;
};

export default Vue.extend({
  name: "FdPagination",
  props: {
    itemsPerPage: { type: Number, default: 10 } as PropValidator<number>,
    itemsTotal: { type: Number, required: true } as PropValidator<number>,
    initialPage: { type: Number, default: 1 } as PropValidator<number>,
    displayTotal: { type: Boolean, default: true } as PropValidator<boolean>,
    totalText: { type: String, default: "" } as PropValidator<string>
  },
  computed: {
    pages(): Page[] {
      const numbers = Array.from({ length: this.numberOfPages }).map(
        (_, index) => index
      );
      let notSuppressed = true;
      const pages: Page[] = [];
      for (const number of numbers) {
        if (this.isClickablePage(number)) {
          pages.push({
            number,
            type: "normal"
          });
          notSuppressed = true;
        } else if (notSuppressed === true) {
          pages.push({
            number,
            type: "more"
          });
          notSuppressed = false;
        }
      }
      return pages;
    },
    formattedTotalText(): string {
      return this.totalText || "items";
    },
    numberOfPages(): number {
      return Math.ceil(this.itemsTotal / (this.itemsPerPage || 10));
    }
  },
  methods: {
    isClickablePage(page: number): boolean {
      return (
        page === 0 ||
        page === this.numberOfPages - 1 ||
        (page >= this.selectedPage - this.numberOfNeighbour - 1 &&
          page <= this.selectedPage + this.numberOfNeighbour - 1)
      );
    },

    pageClicked(event: Event) {
      const element = event.target as HTMLAnchorElement;
      this.selectedPage = (element && +element.text) || 1;
      this.$emit("update:initialPage", this.selectedPage);
    },
    navigateToFirst() {
      this.selectedPage = 1;
      this.$emit("update:initialPage", this.selectedPage);
    },
    navigateToLast() {
      this.selectedPage = this.numberOfPages;
      this.$emit("update:initialPage", this.selectedPage);
    },
    navigateForward() {
      if (this.selectedPage === this.numberOfPages) {
        return;
      }
      ++this.selectedPage;
      this.$emit("update:initialPage", this.selectedPage);
    },
    navigateBack() {
      if (this.selectedPage === 1) {
        return;
      }
      --this.selectedPage;
      this.$emit("update:initialPage", this.selectedPage);
    },
    keyHandler(e: KeyboardEvent) {
      const key = e.code;
      if (key === "Home") {
        this.navigateToFirst();
      } else if (key === "End") {
        this.navigateToLast();
      } else if (key === "ArrowLeft" || key === "ArrowUp" || key === "PageUp") {
        this.navigateBack();
      } else if (
        key === "ArrowRight" ||
        key === "ArrowDown" ||
        key === "PageDown"
      ) {
        this.navigateForward();
      }
    }
  },
  data() {
    return {
      // when selectedPage = 27, render like [1,...26,27,28,...100]
      selectedPage: this.initialPage ? this.initialPage : (1 as number),
      numberOfNeighbour: 1
    };
  }
});
</script>
