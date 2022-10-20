import Nightmare from 'nightmare';

describe('Login', () => {
  let page;
  beforeEach(() => {
    page = Nightmare();
    page.goto('http://localhost:8000/#/user/login');
  });

  it('should login with failure', async () => {
    await page.wait('.ant-tabs')
      .type('#username', 'mockuser')
      .type('#password', 'wrong_password')
      .click('button[type="submit"]')
      .wait('.ant-alert-error') // should display error
      .end();
  });

  it('should login successfully', async () => {
    const text = await page.wait('.ant-tabs')
      .type('#username', 'admin')
      .type('#password', '888888')
      .click('button[type="submit"]')
      .wait('.ant-layout-sider h1') // should display error
      .evaluate(() => document.body.innerHTML)
      .end();
    expect(text).toContain('<h1>一刻间</h1>');
  });
});
