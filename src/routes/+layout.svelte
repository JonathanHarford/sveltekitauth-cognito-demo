<script lang="ts">
    import { signOut } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
  </script>
  <div>
    <header>
      {#if $page.data.session}
        <div>
          <strong>Hello {$page.data.session.user?.name}</strong>
          <button on:click|preventDefault={signOut} class="button">Sign out</button>
        </div>
      {:else}
        <a href="/auth/login" class="buttonPrimary">Sign in</a>
      {/if}
    </header>
    <slot />
  </div>