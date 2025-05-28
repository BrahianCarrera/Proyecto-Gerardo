import React from 'react'
import { View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeAreaContainer = ({ style, ...props }: ViewProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
        style,
      ]}
      {...props}
    />
  )
}

export default SafeAreaContainer
