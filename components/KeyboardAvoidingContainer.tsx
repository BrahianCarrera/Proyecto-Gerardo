// components/KeyboardAvoidingContainer.js

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native'
import SafeAreaContainer from './safeAreaContainer'

const KeyboardAvoidingContainer = ({
  children,
  containerClassName = {},
}: any) => {
  return (
    <SafeAreaContainer
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
        containerClassName,
      ]}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 my-6"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}

export default KeyboardAvoidingContainer
