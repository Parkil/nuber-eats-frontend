import {gql, useMutation} from "@apollo/client";
import {ExecEditProfileMutation, ExecEditProfileMutationVariables} from "../__graphql_type/type";

export const EDIT_PROFILE_MUTATION = gql`
  mutation execEditProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

export const useEditProfile = (onCompleted: (data: ExecEditProfileMutation) => void) => {
  return useMutation<ExecEditProfileMutation, ExecEditProfileMutationVariables>(EDIT_PROFILE_MUTATION, {
    onCompleted
  });
}
