import { mount, enableAutoUnmount } from '@vue/test-utils'
import * as apiComposables from 'composables/api'
import { useCurrentUser } from 'composables/useCurrentUser'
import { getByTestId } from 'testUtils'
import SiteNavbar from './SiteNavbar.vue'

function getSiteNavbarWrapper() {
  return mount(SiteNavbar)
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

enableAutoUnmount(afterEach)

describe('<SiteNavbar />', () => {
  it('should render without crashing', () => {
    const wrapper = getSiteNavbarWrapper()

    expect(wrapper.isVisible()).toBe(true)
  })

  describe('when no user is logged in', () => {
    it('should render the login/sign up buttons', () => {
      const wrapper = getSiteNavbarWrapper()

      expect(getByTestId(wrapper, 'site-navbar-login-button').isVisible()).toBe(
        true,
      )

      expect(
        getByTestId(wrapper, 'site-navbar-sign-up-button').isVisible(),
      ).toBe(true)
    })

    describe('when the login button is clicked', () => {
      it('should bring up the login card', () => {
        const wrapper = getSiteNavbarWrapper()

        getByTestId(wrapper, 'site-navbar-login-button').trigger('click')

        expect(getByTestId(wrapper, 'log-in-card').isVisible()).toBe(true)
      })
    })

    describe('when the sign up button is clicked', () => {
      it('should bring up the signup card', () => {
        const wrapper = getSiteNavbarWrapper()

        getByTestId(wrapper, 'site-navbar-sign-up-button').trigger('click')

        expect(getByTestId(wrapper, 'sign-up-card').isVisible()).toBe(true)
      })
    })
  })

  describe('when a user is logged in', () => {
    beforeEach(() => {
      const currentUser = useCurrentUser()
      currentUser.value = {
        admin: true,
        email: 'admin@leaderboards.gg',
        username: 'lbgg_admin',
      }
    })

    it('should render the logout button', () => {
      const wrapper = getSiteNavbarWrapper()

      expect(
        getByTestId(wrapper, 'site-navbar-logout-button').isVisible(),
      ).toBe(true)
    })

    describe('when the logout button is clicked', () => {
      const useLogoutUserSpy = vi.spyOn(apiComposables, 'useLogoutUser')

      it('should log out the user', async () => {
        const wrapper = getSiteNavbarWrapper()

        await getByTestId(wrapper, 'site-navbar-logout-button').trigger('click')

        expect(useLogoutUserSpy).toHaveBeenCalled()
      })
    })
  })
})
