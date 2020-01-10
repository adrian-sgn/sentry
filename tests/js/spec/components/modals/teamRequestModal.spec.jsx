import {Modal} from 'react-bootstrap';
import React from 'react';

import {mountWithTheme} from 'sentry-test/enzyme';
import TeamRequestModal from 'app/components/modals/teamRequestModal';

describe('TeamRequestModal', function() {
  let wrapper;
  let createMock;
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const orgId = TestStubs.Organization().id;
  const memberId = TestStubs.Member().id;
  const teamId = TestStubs.Team().id;
  const url = `/organizations/${orgId}/members/${memberId}/teams/${teamId}/`;

  const modalRenderProps = {
    Body: Modal.Body,
    Footer: Modal.Footer,
    Header: Modal.Header,
    closeModal,
    onClose,
  };

  beforeEach(function() {
    MockApiClient.clearMockResponses();
    wrapper = mountWithTheme(
      <TeamRequestModal
        orgId={orgId}
        teamId={teamId}
        memberId={memberId}
        {...modalRenderProps}
      />,
      TestStubs.routerContext()
    );
    createMock = MockApiClient.addMockResponse({
      url,
      method: 'POST',
    });
  });

  it('renders', function() {
    expect(wrapper.find('div[className="modal-body"]').text()).toBe(
      'You do not have permission to add members to teams, but we will send a request to your organization admins for approval.'
    );
  });

  it('creates access request on continue', function() {
    wrapper.find('button[aria-label="Continue"]').simulate('click');
    expect(createMock).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('closes modal on cancel', function() {
    wrapper.find('button[aria-label="Cancel"]').simulate('click');
    expect(createMock).not.toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });
});
